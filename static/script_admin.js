var socket = io();
var active = "";

socket.on('activate_button', function(data) {
    var button = document.getElementById('activateButton');
    button.disabled = true;  // Make the button unclickable
    button.style.backgroundColor = 'gray';  // Change background to gray
    button.style.cursor = 'not-allowed';  // Change cursor to indicate it's disabled


    var button = document.getElementById('startButton');
    button.disabled = false;  // Make the button unclickable
    button.style.backgroundColor = '';  // Change background to default
    button.style.cursor = '';  // Change cursor to default

    var button = document.getElementById('deactivateButton');
    button.disabled = false;  // Make the button unclickable
    button.style.backgroundColor = '';  // Change background to default
    button.style.cursor = '';  // Change cursor to default

});

socket.on('start_button', function(data) {
    console.log("start carregado");

    var button = document.getElementById('activateButton');
    button.disabled = true;  // Make the button unclickable
    button.style.backgroundColor = 'gray';  // Change background to gray
    button.style.cursor = 'not-allowed';  // Change cursor to indicate it's disabled


    var button = document.getElementById('startButton');
    button.disabled = true;  // Make the button unclickable
    button.style.backgroundColor = 'gray';  // Change background to gray
    button.style.cursor = 'not-allowed';  // Change cursor to indicate it's disabled

    var button = document.getElementById('deactivateButton');
    button.disabled = false;  // Make the button unclickable
    button.style.backgroundColor = '';  // Change background to gray
    button.style.cursor = '';  // Change cursor to indicate it's disabled

});

socket.on('deactivate_button', function(data) {
    
    var button = document.getElementById('activateButton');
    button.disabled = false;  // Make the button unclickable
    button.style.backgroundColor = '';  // Change background to gray
    button.style.cursor = '';  // Change cursor to indicate it's disabled


    var button = document.getElementById('startButton');
    button.disabled = false;  // Make the button unclickable
    button.style.backgroundColor = '';  // Change background to gray
    button.style.cursor = '';  // Change cursor to indicate it's disabled

    var button = document.getElementById('deactivateButton');
    button.disabled = true;  // Make the button unclickable
    button.style.backgroundColor = 'gray';  // Change background to gray
    button.style.cursor = 'not-allowed';  // Change cursor to indicate it's disabled

});

socket.on('update_click_order', function(data) {
    var clickOrder = document.getElementById('clickOrder');
    clickOrder.innerHTML = ''; // Clear the list

    console.log("idk");
    data.click_order.forEach(function(user) {
        var li = document.createElement('li');

        console.log(contestat);
        // Set the text color to the player's team color
        li.style.color = user.team;

        // Add the player's name
        li.appendChild(document.createTextNode(user.name));

        // Append the list item to the click order list
        clickOrder.appendChild(li);
    });
});


socket.on('update_locked_out', function(data) {
    // Get references to the team lists
    const blueTeamList = document.getElementById('blueTeam');
    const redTeamList = document.getElementById('redTeam');
    const greenTeamList = document.getElementById('greenTeam');
    const clickOrderList = document.getElementById('clickOrder');

    // Clear the current lists
    blueTeamList.innerHTML = 'Blue Team:';
    redTeamList.innerHTML = 'Red Team:';
    greenTeamList.innerHTML = 'Green Team:';
    clickOrderList.innerHTML = '';

    // Iterate over the locked out contestants
    data.locked_out.forEach(function(contestant) {
        console.log(contestat)
        const listItem = document.createElement('li');
        listItem.textContent = contestant.name;

        // Add the contestant to the corresponding team list
        if (contestant.team === 'blue') {
            blueTeamList.appendChild(listItem);
        } else if (contestant.team === 'red') {
            redTeamList.appendChild(listItem);
        } else if (contestant.team === 'green') {
            greenTeamList.appendChild(listItem);
        }

        // Add the contestant to the click order list
        const clickOrderItem = document.createElement('li');
        clickOrderItem.textContent = `${index + 1}. ${contestant.name} (${contestant.team} Team)`;

        // Set the text color based on the team
        if (contestant.team === 'blue') {
            clickOrderItem.style.color = 'blue';
        } else if (contestant.team === 'red') {
            clickOrderItem.style.color = 'red';
        } else if (contestant.team === 'green') {
            clickOrderItem.style.color = 'green';
        }

        clickOrderList.appendChild(clickOrderItem);

    });
});


socket.on('update_click_order', function(data) {
    // Get references to the team lists
    const blueTeamList = document.getElementById('blueTeam');
    const redTeamList = document.getElementById('redTeam');
    const greenTeamList = document.getElementById('greenTeam');

    // Clear the current lists
    blueTeamList.innerHTML = 'Blue Team:';
    redTeamList.innerHTML = 'Red Team:';
    greenTeamList.innerHTML = 'Green Team:';

    // Iterate over the locked out contestants
    data.locked_out.forEach(function(contestant) {
        const listItem = document.createElement('li');
        listItem.textContent = contestant.name;

        // Add the contestant to the corresponding team list
        if (contestant.team === 'blue') {
            blueTeamList.appendChild(listItem);
        } else if (contestant.team === 'red') {
            redTeamList.appendChild(listItem);
        } else if (contestant.team === 'green') {
            greenTeamList.appendChild(listItem);
        }
    });
});



function startButton() {
    socket.emit('start_button');
}

function activateButton() {
    socket.emit('activate_button');
}

function deactivateButton() {
    socket.emit('deactivate_button');
}
