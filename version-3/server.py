from flask import Flask, request
from flask_socketio import SocketIO, send

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

clients = {}
gameState = False

@socketio.on('message')
def handle_message(msg):
    if msg[0] == "join":
        clients[request.sid] = msg[1]
        clientsList = []
        for i in range(len(clients)):
            clientsList.append(clients[list(clients.keys())[i]])
        send(["join", msg[1], clientsList], broadcast=True)
        print(f"join: {msg[1]}")
        print(clients)
    elif msg == "game":
        send(["game", gameState], broadcast=True)
        print(f"player has requested game statem which is {gameState}.")
    else:
        send(msg, broadcast=True)
        print(f"received: {msg}")

@socketio.on('disconnect')
def handle_disconnect():
    name = clients.pop(request.sid, None)
    if name:
        send(["leave", name], broadcast=True)
        print(f"leave: {name}")

socketio.run(app, host='0.0.0.0', port=5000)
