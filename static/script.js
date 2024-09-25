var socket = io();
var username = '';

function joinGame() {
    username = document.getElementById('username').value;
    if (username) {
        socket.emit('join_contestant', { username: username });
    }
}

socket.on('join_success', function(data) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('game').style.display = 'block';
});

socket.on('join_failure', function(data) {
    alert(data.message);
});

function clickButton() {
    socket.emit('button_click', { username: username });
}

socket.on('button_status', function(data) {
    document.getElementById('gameButton').disabled = !data.active;
    if (data.active) {
        document.getElementById('status').innerHTML = 'Button is active!';
    } else {
        document.getElementById('status').innerHTML = 'Waiting for button to be activated...';
    }
});

socket.on('first_click', function(data) {
    alert(data.message);
});

socket.on('click_ack', function(data) {
    alert(data.message);
});

socket.on('click_fail', function(data) {
    alert(data.message);
});

socket.on('update_click_order', function(data) {
    var clickOrder = document.getElementById('clickOrder');
    clickOrder.innerHTML = '';
    data.click_order.forEach(function(user) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(user));
        clickOrder.appendChild(li);
    });
});

socket.on('update_locked_out', function(data) {
    var lockedOut = document.getElementById('lockedOut');
    lockedOut.innerHTML = '';
    data.click_order.forEach(function(user) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(user));
        lockedOut.appendChild(li);
    });
});

function startButton() {
    socket.emit('start_button');
}

function activateButton() {
    socket.emit('activate_button');
}

function resetButton() {
    socket.emit('reset_button');
}

document.addEventListener('keydown', function(event) {
    // Check if the pressed key is the spacebar (key code 32)
    if (event.code === 'Space') {
        event.preventDefault(); // Prevent the default action (e.g., scrolling)
        clickButton(); // Call the function
    }
});
