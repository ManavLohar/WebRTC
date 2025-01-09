const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const io = new Server({
  cors: true,
});
const app = express();

app.use(bodyParser.json());

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("New Connection: ", socket.id);

  socket.on("join-room", (data) => {
    const { roomId, emailId } = data;
    console.log("User ", emailId, "Joined Room", roomId);

    emailToSocketMapping.set(emailId, socket.id);
    socketToEmailMapping.set(socket.id, emailId);

    socket.join(roomId);
    socket.emit("joined-room", { roomId });

    // Emit user-joined event after the user has joined the room
    socket.broadcast.to(roomId).emit("user-joined", { emailId });
  });

  socket.on("call-user", (data) => {
    const { emailId, offer } = data;
    const fromEmail = socketToEmailMapping.get(socket.id);
    const socketId = emailToSocketMapping.get(emailId);

    console.log(`Calling ${emailId} from ${fromEmail}`);

    if (socketId) {
      socket.to(socketId).emit("incoming-call", { from: fromEmail, offer });
    } else {
      console.log(`No socket found for email: ${emailId}`);
    }
  });

  socket.on("call-accepted", (data) => {
    const { emailId, ans } = data;
    const socketId = emailToSocketMapping.get(emailId);

    console.log(`Call accepted by ${emailId}`);

    if (socketId) {
      socket.to(socketId).emit("call-accepted", { ans });
    } else {
      console.log(`No socket found for email: ${emailId}`);
    }
  });
});

app.listen(8000, () => {
  console.log("Server running at PORT: 8000");
});

io.listen(8001);
