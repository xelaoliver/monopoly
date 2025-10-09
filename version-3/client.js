const socket = io("http://localhost:5000");
offonline = true;
nameVerify = false;

socket.on("connect", () => {
    console.log("yay. server is connected to client!");

    if (((window.innerWidth <= 800) && (window.innerHeight <= 600))) {
        document.getElementById("offonline").innerHTML = 'This site requires you to have a keyboard/mouse and a display larger than 800x600px.';
    } else {
        document.getElementById("offonline").innerHTML = 'Name: <input type="text" id="name" autocomplete="off"> <button onclick="join()">Join</button><br><br>The server is <span style="color: green;">online</span>';
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
            document.getElementById("offonline").innerHTML = 'The server is <span style="color: green;">online</span>, but a game is already in play.<br>Please wait until the game ends.';
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
    } else if (msg[0] == "join") {
        document.getElementById("player-number").innerHTML = msg[2].length;

        document.getElementById("player-list").textContent = "";
        for (let i = 0; i < msg[2].length; i++) {
            const client = document.createElement("li");
            client.textContent = msg[2][i];
            client.id = msg[2][i];
            
            document.getElementById("player-list").appendChild(client);
        }

        document.getElementById("log").innerHTML = `<span style="color: red;">${msg[1]} has joined the game.</span><br>`+document.getElementById("log").innerHTML;
    } else if (msg[0] == "newclientreturn") {
        nameVerify = msg[1];
        if (nameVerify) {
            console.log("good name");

            socket.send(["join", name]);

            document.getElementById("home").style.display = "none";
            document.getElementById("game").style.display = "grid";
        } else {
            console.log("not good name");

            alert("This name has been taken by "+name+", please use another one.");
        }
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