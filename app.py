from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

contestants = []
locked_out = []
click_order = []
button_active = False
button_started = False

# ----------------
# Routes
# ----------------


@app.route('/')
def index():
    return "Welcome to Jeopardy Controller"


@app.route('/admin')
def admin():
    return render_template('admin.html')


@app.route('/contestant')
def contestant():
    return render_template('contestant.html')

# ----------------
# Socket behaviour
# ----------------


@socketio.on('join_contestant')
def handle_join(data):
    global contestants
    username = data['username']
    team = data['team']
    print("join data:")
    print(data)
    if username not in [a for (a, b) in contestants]:
        print(username, " just joined the room")
        contestants.append((username, team))
        emit('join_success', {'username': username})
    else:
        emit('join_failure', {'message': 'Username already taken'})


@socketio.on('button_click')
def handle_click(data):
    global button_active, click_order, locked_out
    username = data['username']

    if not button_active:
        emit('click_fail', {'message': 'Button not active'}, room=request.sid)
        return

    if button_active and not button_started:
        emit('click_fail', {'message': 'Button not started, you are locked out for this round'}
             , room=request.sid)
        locked_out.append(username)
        return

    if username in click_order + locked_out:
        emit('click_fail', {'message': 'Already clicked'}, room=request.sid)
    else:
        click_order.append(username)
        if len(click_order) == 1:
            emit('first_click', {'message': 'You were first!'}, room=request.sid)
        else:
            emit('click_ack', {'message': 'You clicked the button'}, room=request.sid)

        emit('update_locked_out', {
            'locked_out': [{'name': a, 'team': b} for (a, b) in contestant if a in locked_out]
        }, broadcast=True)

        emit('update_click_oder', {
            'click_order': [{'name': a, 'team': b} for (a, b) in contestant if a in click_order]
        }, broadcast=True)


# activates button, it is clickable but locks out participants
@socketio.on('activate_button')
def activate_button():
    global button_active, click_order, locked_out
    print("activate button")
    button_active = True
    locked_out = []
    click_order = []
    # emit('activate_button', {'active': button_active}, broadcast=True)
    updateButtonState()


# starts button, From this point forwerdas, clicks count
@socketio.on('start_button')
def start_button():
    global button_started, click_order
    print("start button")
    if button_active:
        button_started = True
    click_order = []
    # emit('start_button', {'active': button_active}, broadcast=True)
    updateButtonState()


# deletes all button related state, restarts a round
@socketio.on('deactivate_button')
def reset_button():
    global button_active, button_started
    print("deactivate button")
    button_active = False
    button_started = False
    # emit('deactivate_button', {'active': button_active}, broadcast=True)
    updateButtonState()


def updateButtonState():
    global button_started, button_active
    if not button_active and not button_started:
        emit('deactivate_button', {'active': button_active}, broadcast=True)
    elif button_active and not button_started:
        emit('activate_button', {'active': button_active}, broadcast=True)
    elif button_started:
        emit('start_button', {'active': button_active}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=15123, debug=False)
