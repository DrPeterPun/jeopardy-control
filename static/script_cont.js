var socket = io();
var username = '';
var team = '';
var active = false;

function joinGame() {
    username = document.getElementById('username').value;
    team = document.querySelector('input[name="team"]:checked').value;
    if (username) {
        socket.emit('join_contestant', { username: username , team: team});
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

socket.on('activate_button', function(data) {
    document.getElementById('gameButton').disabled = false;
    document.getElementById('status').innerHTML = 'Button is active!';
});

socket.on('deactivate_button', function(data) {
    document.getElementById('gameButton').disabled = true;
    document.getElementById('status').innerHTML = 'Button is not! active!';
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



document.addEventListener('keydown', function(event) {
    // Check if the pressed key is the spacebar (key code 32)
    if (event.code === 'Space') {
        event.preventDefault(); // Prevent the default action (e.g., scrolling)
        clickButton(); // Call the function
    }
});
