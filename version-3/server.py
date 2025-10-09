from flask import Flask, request
from flask_socketio import SocketIO, send

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

clients = {}
gameState = False

@socketio.on('message')
def handle_message(msg):
    print(f"received: {msg}")

    if msg[0] == "join":
        clients[request.sid] = msg[1]
        
        clientsList = list(clients.values())
        
        send(["join", msg[1], clientsList], broadcast=True)
        print(f"join: {msg[1]}")
        print("clients:", clients, "client names:", clientsList)
    elif msg == "game":
        send(["game", gameState, ], broadcast=True)
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
    else:
        send(msg, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    name = clients.pop(request.sid, None)
    if name:
        clientsList = list(clients.values())

        send(["leave", name, clientsList], broadcast=True)
        print(f"leave: {name}")

socketio.run(app, host='0.0.0.0', port=5000)
