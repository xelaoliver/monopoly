# Alex Oliver, 2025

from flask import Flask, request
from flask_socketio import SocketIO, send

print("Running Alex Oliver's Monopoly Server...")

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

clients = {}
playerInformation = {}
playerIndex = 0
votekick = []
voteStart = 0
clientsThatHaveVoted = []
gameState = False

print("SocketIO sucessfull.")
print("Game and debugging logs will be printed out onto the console.\n")

# remove all traces of client
def removeClient(sid):
    name = clients.get(sid)
    if name:
        del playerInformation[name]
        del clients[sid]
        return name
    return None

@socketio.on('message')
def handle_message(msg):
    global gameState
    global voteStart

    clientsList = list(clients.values())

    print(f"received: {msg}")

    if msg[0] == "join":
        # add client to list and broadcast join message

        clients[request.sid] = msg[1]
        votekick.append(msg[1])
        votekick.append(0)

        # add to playerInformation
        playerInformation[msg[1]] = {
            "tileNumber": 0,
            "playerToken": len(clientsList),
            "money": 0,
            "cards": [],
            "token": len(clientsList)
        }
        
        send(["join", msg[1], len(clientsList), clientsList], broadcast=True)
        print(f"join: {msg[1]}")
        print("clients:", clients, "client names:", clientsList)
    elif msg == "game":
        # send the game status to anyone who has loaded onto the homepage

        # check if server is full (max. 9 clients because we have 9 player-tokens)
        noJoinBecauseFull = True
        if len(clientsList) <= 9:
            noJoinBecauseFull = False

        send(["game", gameState, noJoinBecauseFull], broadcast=request.sid)
        print(f"player has requested game statem which is {gameState}.")
    elif msg[0] == "newclient":
        # verify that their name is not already in the game

        clientsList = list(clients.values())

        if msg[1] in clientsList:
            send(["newclientreturn", False], to=request.sid)
            print("client attempted to put in already existing name:", msg[1])
        else:
            clients[request.sid] = msg[1]
            send(["newclientreturn", True, len(clientsList)], to=request.sid)
            print("client put in new name:", msg[1])
    elif msg[0] == "votekick":
        # cast a democratic vote (defeats the whole point of communist mode) to kick a player, that way no one player is stalin

        i = votekick.index(msg[1])+1
        votekick[i] += 1

        clientsList = list(clients.values())
        if votekick[i] >= len(clientsList):
            sid = list(clients.keys())[list(clients.values()).index(msg[1])]
            send("kick", to=sid)
            removeClient(sid)

            clientsList = list(clients.values())
            send(["leave", msg[1], clientsList], broadcast=True)

            print("kicked:", msg[1])
            playersInLobby()
        else:
            send(["votekick", msg[1], msg[2]], broadcast=True)
    elif msg[0] == "votestart":
        # make sure
        if gameState:
            voteStart = 0

        # cast a democratic vote to start the game, also works for holding the start of the game

        clientsList = list(clients.values())

        if msg[1] not in clientsThatHaveVoted:
            voteStart += 1
            clientsThatHaveVoted.append(msg[1])

            playerInformation[msg[1]]["voted"] = True

            print("votes to start:", voteStart, " and number of clients:", len(clientsList))
            if voteStart == len(clientsList) and voteStart >= 2 and len(clientsList) >= 2:
                gameState = True
                send(["gamestart", playerInformation, len(clientsList), playerIndex, clientsList], broadcast=True)

                print("game starting")
            else:
                send(["votestart", msg[1], len(clientsList), voteStart, clientsList], broadcast=True)

                print(msg[1], "has voted to start, the number of votes is now:", voteStart, ". and there are:", len(clientsList), "people")
    elif msg[0] == "voteholdstart":
        clientsList = list(clients.values())
        
        voteStart -= 1
        clientsThatHaveVoted.remove(msg[1])
        playerInformation[msg[1]]["voted"] = False

        print(msg[1], "has voted to hold the start start, the number of votes is now:", voteStart, ". and there are:", len(clientsList), "people")
        send(["voteholdstart", msg[1], len(clientsList), clientsList], broadcast=True)
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

    name = removeClient(request.sid)

    if name:
        clientsList = list(clients.values())

        send(["leave", name, clientsList], broadcast=True)
        print(f"leave: {name}")
        playersInLobby()

        if clientsList == 0:
            voteStart = 0
        elif not gameState and name in clientsThatHaveVoted:
            voteStart -= 1

def playersInLobby():
    # simple, it just does smth when no players are in the lobby

    global gameState
    clientsList = list(clients.values())

    if len(clientsList) == 0:
        gameState = False
        
        print("no players are in the lobby.")

socketio.run(app, host='0.0.0.0', port=5000)
