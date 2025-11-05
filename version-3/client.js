const socket = io("http://localhost:5000");
var offonline = true;
var nameVerify = false;
var oldVoteKickName = "";
var playerInformation = {};

socket.on("connect", () => {
    console.log("yay. server is connected to client!");

    // status of the server
    if (((window.innerWidth <= 800) && (window.innerHeight <= 600))) {
        document.getElementById("offonline").innerHTML = `
        This site requires you to have a keyboard/mouse and a display larger than 800x600px.
        `;
    } else {
        document.getElementById("offonline").innerHTML = `
        Name: <input type="text" id="name" autocomplete="off"> <button onclick="join()">
        Join</button><br><br>The server is <span style="color: green;">online</span>`;
        socket.send("game");
    }
});

socket.on("connect_error", (err) => {
    // debug information
    console.log("uh oh. client is not connected: "+err);
});

socket.on("message", (msg) => {
    console.log(msg);

    if (msg[0] == "game" && offonline) {
        // status of the server's lobby
        if (msg[1]) {
            document.getElementById("offonline").innerHTML = `
            The server is <span style="color: green;">online</span>
            , but a game is already in play.<br>Please wait until the game ends.`;
            console.log("game already in play");
        } else {
            document.getElementById("offonline").innerHTML += ' and players will be waiting in the lobby.';
            console.log("free game availaible");
        }

        offonline = false;
    } else if (msg[0] == "msg") {
        document.getElementById("log").innerHTML = `${msg[1]}: ${msg[2].replace("\n", "<br>")}<br>`+document.getElementById("log").innerHTML;
    } else if (msg[0] == "leave") {   
        // Player has left the game.
        document.getElementById("log").innerHTML = `<span style="color: red;">${msg[1]} has left the game.</span><br>`+document.getElementById("log").innerHTML;

        // change player-number and player-list so its in sync w/ the server
        document.getElementById("player-number").innerHTML = msg[2].length;
        document.getElementById("player-list").textContent = "";
        for (let i = 0; i < msg[2].length; i++) {
            const client = document.createElement("li");
            client.textContent = msg[2][i];
            client.id = msg[2][i];
            
            document.getElementById("player-list").appendChild(client);
        }

        // change vote-kick options so its in sync w/ the server
        document.getElementById("vote-kick").textContent = "";
        for (let i = 0; i < msg[2].length; i++) {
            const client = document.createElement("option");
            client.textContent = msg[2][i];
            client.id = msg[2][i];
            client.value = msg[2][i];
            
            document.getElementById("vote-kick").appendChild(client);
        }
    } else if (msg[0] == "join") {
        // change player-number and player-list so its in sync w/ the server
        document.getElementById("player-number").innerHTML = msg[2].length;
        document.getElementById("player-list").textContent = "";
        for (let i = 0; i < msg[2].length; i++) {
            const client = document.createElement("li");
            client.textContent = msg[2][i];
            client.id = msg[2][i];
            
            document.getElementById("player-list").appendChild(client);
        }

        // change vote-kick options so its in sync w/ the server
        document.getElementById("vote-kick").textContent = "";
        for (let i = 0; i < msg[2].length; i++) {
            const client = document.createElement("option");
            client.textContent = msg[2][i];
            client.id = msg[2][i];
            client.value = msg[2][i];
            
            document.getElementById("vote-kick").appendChild(client);
        }

        // Player has joined the game.
        document.getElementById("log").innerHTML = `<span style="color: red;">${msg[1]} has joined the game.</span><br>`+document.getElementById("log").innerHTML;
    } else if (msg[0] == "newclientreturn") {
        // checks if inputted name is already a client in the server

        nameVerify = msg[1];
        if (nameVerify) {
            console.log("good name");

            socket.send(["join", name]);

            // remove homepage, display game page
            document.getElementById("home").style.display = "none";
            document.getElementById("game").style.display = "grid";

            document.getElementById("name-display").innerHTML = name;

            document.getElementById("name").value = "";
            
            // start board rendering
            let script = document.createElement('script');
            script.src = "board.js";
            script.type = "module";
            document.body.appendChild(script);
        } else {
            console.log("not good name");

            alert("This name has been taken by "+name+", please use another one.");
        }
    } else if (msg == "kick") {
        console.log("you have been kicked, lol");

        // remove game page, display homepage, automatically removes client from client list in server
        document.getElementById("home").style.display = "inline";
        document.getElementById("game").style.display = "none";
    } else if (msg[0] == "votekick") {
        // Player has cast a vote to kick Player. the server handles all of that
        document.getElementById("log").innerHTML = `
            <span style="color: red;">${msg[2]} has cast a vote to kick ${msg[1]}.</span><br>
        `+document.getElementById("log").innerHTML;
    } else if (msg[0] == "votestart") {
        // Player has cast a vote to start the game. the server, again, handles all of that
        document.getElementById("log").innerHTML = `
            <span style="color: red;">${msg[1]} has cast a vote to start the game.</span><br>
        `+document.getElementById("log").innerHTML;
    } else if (msg[0] == "voteholdstart") {
        // Player has cast a vote to hold the start of the game. guess what? the server handles all of that
        document.getElementById("log").innerHTML = `
            <span style="color: red;">${msg[1]} has cast a vote to hold the start of the game.</span><br>
        `+document.getElementById("log").innerHTML;
    } else if (msg[0] == "gamestart") {
        // game initialates and clients can play Alex Oliver's Monopoly
        console.log("!!!!!game has started!!!!!");

        // create playerInformation so save locally all the player's card, money, tile, ect...
        playerInformation = msg[1];

        console.log("playerInformation:", playerInformation);

        const keys = Object.keys(playerInformation);
        let orderOfPlayers = keys.length?`${keys[0]} will go first`:"No players";
        for (let i = 1; i < keys.length; i++) {
            orderOfPlayers += `, then ${keys[i]}`;
        }

        document.getElementById("log").innerHTML = `
            <span style="color: red;">The game has started. ${orderOfPlayers}.</span><br>
        `+document.getElementById("log").innerHTML;

        // hide vote-start
        document.getElementById("game-begin-options").style.display = "none";
    }

    // scroll chat/game log to the top
    document.getElementById("log").scrollTop = 0;
});

function join() {
    name = document.getElementById("name").value;

    if (name == "") {
        return;
    }

    // see line 92
    socket.send(["newclient", name]);
}

function sendMessage() {
    msg = document.getElementById("message").value;

    if (msg == "") {
        return;
    }

    socket.send(["msg", name, msg]);
    document.getElementById("message").value = "";
}

function voteStart(start) {
    if (start) {
        socket.send(["votestart", name]);

        // show vote-hold-start and hide vote-start
        document.getElementById("vote-start").style.display = "none";
        document.getElementById("vote-hold-start").style.display = "inline";

        console.log("voted to start");
    } else {
        socket.send(["voteholdstart", name]);

        // show vote-hold-start and hide vote-start
        document.getElementById("vote-start").style.display = "inline";
        document.getElementById("vote-hold-start").style.display = "none";

        console.log("voted to hold start");
    }
}

function voteKick() {
    // get client from <select> in html
    var voteKickName = document.getElementById("vote-kick").value;

    if (voteKickName != oldVoteKickName) {
        socket.send(["votekick", voteKickName, name]);

        console.log("voted to kick "+voteKickName);
    } else {
        console.log("already voted to kick "+voteKickName);
    }

    // make it so that the client can only kick another client one time in a row
    oldVoteKickName = voteKickName;
}
