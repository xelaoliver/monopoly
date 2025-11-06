# Alex Oliver, 2025

from flask import Flask, request
from flask_socketio import SocketIO, send

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

clients = {}
playerInformation = {}
playerIndex = 0
votekick = []
voteStart = 0
gameState = False

@socketio.on('message')
def handle_message(msg):
    global gameState
    global voteStart
    print(f"received: {msg}")

    if msg[0] == "join":
        # add client to list and broadcast join message

        clients[request.sid] = msg[1]
        votekick.append(msg[1])
        votekick.append(0)

        clientsList = list(clients.values())

        # add to playerInformation
        playerInformation[msg[1]] = {
            "tileNumber": 0,
            "playerToken": len(clientsList),
            "money": 0,
            "cards": []
        }
        
        send(["join", msg[1], clientsList], broadcast=True)
        print(f"join: {msg[1]}")
        print("clients:", clients, "client names:", clientsList)
    elif msg == "game":
        # send the game status to anyone who has loaded onto the homepage

        send(["game", gameState], broadcast=request.sid)
        print(f"player has requested game statem which is {gameState}.")
    elif msg[0] == "newclient":
        # verify that their name is not already in the game

        clientsList = list(clients.values())

        if msg[1] in clientsList:
            send(["newclientreturn", False], to=request.sid)
            print("client attempted to put in already existing name:", msg[1])
        else:
            clients[request.sid] = msg[1]
            send(["newclientreturn", True], to=request.sid)
            print("client put in new name:", msg[1])
    elif msg[0] == "votekick":
        # cast a democratic vote (defeats the whole point of communist mode) to kick a player, that way no one player is stalin

        i = votekick.index(msg[1])+1
        votekick[i] += 1

        if votekick[i] >= (3*len(clients))/4:
            # should probally make it so votes go down after like 60 seconds to prevent just one person from 
            # vote kicking everyone off the game

            sid = list(clients.keys())[list(clients.values()).index(msg[1])]
            send("kick", to=sid)
            clients.pop(sid)

            clientsList = list(clients.values())
            send(["leave", msg[1], clientsList], broadcast=True)

            print("kicked:", msg[1])
            playersInLobby()
        else:
            send(["votekick", msg[1], msg[2]], broadcast=True)
    elif msg[0] == "votestart":
        # cast a democratic vote to start the game, also works for holding the start of the game

        clientsList = list(clients.values())

        voteStart += 1
        print("votes to start:", voteStart, " and number of clients:", len(clientsList))
        if voteStart > len(clientsList)/2: # old version: voteStart >= (3*len(clients))/4
            gameState = True
            send(["gamestart", playerInformation, playerIndex], broadcast=True)
        else:
            send(["votestart", msg[1]], broadcast=True)
    elif msg[0] == "voteholdstart":
        voteStart -= 1
        send(["voteholdstart", msg[1]], broadcast=True)
    elif msg[0] == "tileNumber":
        # update player's tile number (aka: position)
        playerInformation[msg[1]]["tileNumber"] += msg[2]
        
        send(["tileNumberMove", msg[1], playerInformation], broadcast=True)
    else:
        send(msg, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    # sends to all clients that one of them as left
    
    global gameState, voteStart, playerInformation

    # remove client from playerInformation and clients
    del playerInformation[clients[request.sid]]
    name = clients.pop(request.sid, None)

    if name:
        clientsList = list(clients.values())

        send(["leave", name, clientsList], broadcast=True)
        print(f"leave: {name}")
        playersInLobby()

        if clientsList == 0:
            voteStart = 0
        elif not gameState:
            voteStart -= 1

def playersInLobby():
    # simple, it just does smth when no players are in the lobby

    global gameState
    clientsList = list(clients.values())

    if len(clientsList) == 0:
        gameState = False
        
        print("no players are in the lobby.")

socketio.run(app, host='0.0.0.0', port=5000)
