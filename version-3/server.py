from flask import Flask, request
from flask_socketio import SocketIO, send

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

clients = {}
votekick = []
voteStart = 0
gameState = False

@socketio.on('message')
def handle_message(msg):
    global gameState
    global voteStart
    print(f"received: {msg}")

    if msg[0] == "join":
        clients[request.sid] = msg[1]
        votekick.append(msg[1])
        votekick.append(0)
        
        clientsList = list(clients.values())
        
        send(["join", msg[1], clientsList], broadcast=True)
        print(f"join: {msg[1]}")
        print("clients:", clients, "client names:", clientsList)
    elif msg == "game":
        send(["game", gameState], broadcast=request.sid)
        print(f"player has requested game statem which is {gameState}.")
    elif msg[0] == "newclient":
        clientsList = list(clients.values())

        if msg[1] in clientsList:
            send(["newclientreturn", False], to=request.sid)
            print("client attempted to put in already existing name:", msg[1])
        else:
            clients[request.sid] = msg[1]
            send(["newclientreturn", True], to=request.sid)
            print("client put in new name:", msg[1])
    elif msg[0] == "votekick":
        i = votekick.index(msg[1])+1
        votekick[i] += 1

        if votekick[i] >= len(clients)/2:
            send("kick", to=list(clients.keys())[list(clients.values()).index(msg[1])])
            clients.pop(list(clients.keys())[list(clients.values()).index(msg[1])])

            clientsList = list(clients.values())
            send(["leave", msg[1], clientsList], broadcast=True)

            print("kicked:", msg[1])
            playersInLobby()
        else:
            send(["votekick", msg[1], msg[2]], broadcast=True)
    elif msg[0] == "votestart":
        voteStart += 1
        if voteStart >= len(clients)/2:
            gameState = True
            send("gamestart", broadcast=True)
        else:
            send(["votestart", msg[1]], broadcast=True)
    elif msg[0] == "voteholdstart":
        voteStart -= 1
        send(["voteholdstart", msg[1]], broadcast=True)
    else:
        send(msg, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    global gameState

    name = clients.pop(request.sid, None)
    if name:
        clientsList = list(clients.values())

        send(["leave", name, clientsList], broadcast=True)
        print(f"leave: {name}")
        playersInLobby()

def playersInLobby():
    global gameState
    clientsList = list(clients.values())

    if len(clientsList) == 0:
        gameState = False
        
        print("no players are in the lobby.")

socketio.run(app, host='0.0.0.0', port=5000)
