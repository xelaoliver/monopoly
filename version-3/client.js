const socket = io("http://localhost:5000");
offonline = true;
nameVerify = false;
oldVoteKickName = "";

socket.on("connect", () => {
    console.log("yay. server is connected to client!");

    if (((window.innerWidth <= 800) && (window.innerHeight <= 600))) {
        document.getElementById("offonline").innerHTML = 'This site requires you to have a keyboard/mouse and a display larger than 800x600px.';
    } else {
        document.getElementById("offonline").innerHTML = `
        Name: <input type="text" id="name" autocomplete="off"> <button onclick="join()">
        Join</button><br><br>The server is <span style="color: green;">online</span>`;
        socket.send("game");
    }
});

socket.on("connect_error", (err) => {
    console.log("uh oh. client is not connected: "+err);
});

socket.on("message", (msg) => {
    console.log(msg);

    if (msg[0] == "game" && offonline) {
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
        document.getElementById("log").innerHTML = `<span style="color: red;">${msg[1]} has left the game.</span><br>`+document.getElementById("log").innerHTML;

        document.getElementById("player-number").innerHTML = msg[2].length;

        document.getElementById("player-list").textContent = "";
        for (let i = 0; i < msg[2].length; i++) {
            const client = document.createElement("li");
            client.textContent = msg[2][i];
            client.id = msg[2][i];
            
            document.getElementById("player-list").appendChild(client);
        }

        document.getElementById("vote-kick").textContent = "";
        for (let i = 0; i < msg[2].length; i++) {
            const client = document.createElement("option");
            client.textContent = msg[2][i];
            client.id = msg[2][i];
            client.value = msg[2][i];
            
            document.getElementById("vote-kick").appendChild(client);
        }
    } else if (msg[0] == "join") {
        document.getElementById("player-number").innerHTML = msg[2].length;

        document.getElementById("player-list").textContent = "";
        for (let i = 0; i < msg[2].length; i++) {
            const client = document.createElement("li");
            client.textContent = msg[2][i];
            client.id = msg[2][i];
            
            document.getElementById("player-list").appendChild(client);
        }

        document.getElementById("vote-kick").textContent = "";
        for (let i = 0; i < msg[2].length; i++) {
            const client = document.createElement("option");
            client.textContent = msg[2][i];
            client.id = msg[2][i];
            client.value = msg[2][i];
            
            document.getElementById("vote-kick").appendChild(client);
        }

        document.getElementById("log").innerHTML = `<span style="color: red;">${msg[1]} has joined the game.</span><br>`+document.getElementById("log").innerHTML;
    } else if (msg[0] == "newclientreturn") {
        nameVerify = msg[1];
        if (nameVerify) {
            console.log("good name");

            socket.send(["join", name]);

            document.getElementById("home").style.display = "none";
            document.getElementById("game").style.display = "grid";

            document.getElementById("name").value = "";
        } else {
            console.log("not good name");

            alert("This name has been taken by "+name+", please use another one.");
        }
    } else if (msg == "kick") {
        console.log("you have been kicked, lol");

        document.getElementById("home").style.display = "inline";
        document.getElementById("game").style.display = "none";
    } else if (msg[0] == "votekick") {
        document.getElementById("log").innerHTML = `<span style="color: red;">${msg[2]} has cast a vote to kick ${msg[1]}.</span><br>`+document.getElementById("log").innerHTML;
    } else if (msg[0] == "votestart") {
        document.getElementById("log").innerHTML = `<span style="color: red;">${msg[1]} has cast a vote to start the game.</span><br>`+document.getElementById("log").innerHTML;
    } else if (msg[0] == "voteholdstart") {
        document.getElementById("log").innerHTML = `<span style="color: red;">${msg[1]} has cast a vote to hold the start of the game.</span><br>`+document.getElementById("log").innerHTML;
    } else if (msg == "gamestart") {
        console.log("!!!!!game has started!!!!!");
    }

    document.getElementById("log").scrollTop = 0;
});

function join() {
    name = document.getElementById("name").value;

    if (name == "") {
        return;
    }

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

        document.getElementById("vote-start").style.display = "none";
        document.getElementById("vote-hold-start").style.display = "inline";

        console.log("voted to start");
    } else {
        socket.send(["voteholdstart", name]);

        document.getElementById("vote-start").style.display = "inline";
        document.getElementById("vote-hold-start").style.display = "none";

        console.log("voted to hold start");
    }
}

function voteKick() {
    var voteKickName = document.getElementById("vote-kick").value;

    if (voteKickName != oldVoteKickName) {
        socket.send(["votekick", voteKickName, name]);

        console.log("voted to kick "+voteKickName);
    } else {
        console.log("already voted to kick "+voteKickName);
    }

    oldVoteKickName = voteKickName;
}
