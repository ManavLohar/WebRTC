const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const PORT = 8000;

// Serve static files from the "dist" folder
app.use(express.static(path.join(__dirname, "dist")));

// Handle all other routes by serving the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Create a WebSocket server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const io = new Server(server, {
  cors: true,
});

// WebSocket event handlers (your existing code)
const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
  socket.on("room:join", (data) => {
    const { email, roomId } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);
    io.to(roomId).emit("user:joined", { email, id: socket.id });
    socket.join(roomId);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", (data) => {
    const { to, offer } = data;
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});
