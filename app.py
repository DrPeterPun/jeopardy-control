from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

contestants = []
click_order = []
button_active = False


@app.route('/')
def index():
    return "Welcome to Jeopardy Controller"


@app.route('/admin')
def admin():
    return render_template('admin.html')


@app.route('/contestant')
def contestant():
    return render_template('contestant.html')


@socketio.on('join_contestant')
def handle_join(data):
    global contestants
    username = data['username']
    if username not in contestants:
        print(username, " just joined the room")
        contestants.append(username)
        emit('join_success', {'username': username})
    else:
        emit('join_failure', {'message': 'Username already taken'})


@socketio.on('button_click')
def handle_click(data):
    global button_active, click_order
    username = data['username']

    if not button_active:
        emit('click_fail', {'message': 'Button not active'}, room=request.sid)
        return

    if username in click_order:
        emit('click_fail', {'message': 'Already clicked'}, room=request.sid)
    else:
        click_order.append(username)
        if len(click_order) == 1:
            emit('first_click', {'message': 'You were first!'}, room=request.sid)
        else:
            emit('click_ack', {'message': 'You clicked the button'}, room=request.sid)

        emit('update_click_order', {'click_order': click_order}, broadcast=True)


@socketio.on('activate_button')
def activate_button():
    global button_active, click_order
    button_active = True
    click_order = []
    emit('button_status', {'active': button_active}, broadcast=True)


@socketio.on('deactivate_button')
def deactivate_button():
    global button_active
    button_active = False
    emit('button_status', {'active': button_active}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)
