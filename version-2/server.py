from flask import Flask, request
from flask_socketio import SocketIO, join_room, leave_room, send

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

rooms = {}  # Stores active rooms and their users

@app.route('/')
def home():
    return "WebSocket Server Running"

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    rooms.setdefault(room, []).append(username)
    send(f"{username} joined the room!", to=room)

@socketio.on('send_data')
def handle_send_data(data):
    room = data['room']
    value = data['value']  # String or Integer
    send(value, to=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    rooms[room].remove(username)
    send(f"{username} left the room!", to=room)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)

"""
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>lol</title>
    <script>
      const socket = io("http://localhost:5000"); // Connect to the server

      function joinRoom(username, room) {
          socket.emit("join", { username, room });
      }

      function sendData(room, value) {
          socket.emit("send_data", { room, value });
      }

      function onDataReceived(callback) {
          socket.on("message", callback);
      }

      function leaveRoom(username, room) {
          socket.emit("leave", { username, room });
      }

      // Example Usage:
      joinRoom("Player"+Math.random(), "1234");
      onDataReceived((data) => console.log("Received:", data));
      sendData("1234", "Hello, World!");
      // leaveRoom("Player1", "1234");
    </script>
</head>
<body>
    
</body>
</html>

"""
