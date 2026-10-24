
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.disable("x-powered-by");
app.use(cors({ origin: CLIENT_URL }));

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

const users = new Map();
const messageHistory = [];
const MAX_HISTORY = 100;
const MAX_MESSAGE_LENGTH = 1000;

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Real-Time Chat Server",
    connectedUsers: users.size,
  });
});

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on("join_chat", (rawUsername, callback) => {
    const username =
      typeof rawUsername === "string" ? rawUsername.trim() : "";

    if (!username || username.length > 30) {
      if (typeof callback === "function") {
        callback({
          success: false,
          message: "Username must be between 1 and 30 characters.",
        });
      }
      return;
    }

    // Avoid registering the same socket more than once.
    if (users.has(socket.id)) {
      if (typeof callback === "function") {
        callback({ success: true, history: messageHistory });
      }
      return;
    }

    users.set(socket.id, username);

    socket.emit("chat_history", messageHistory);

    socket.broadcast.emit("user_joined", {
      username,
      message: `${username} joined the chat`,
    });

    io.emit("online_users", Array.from(users.values()));

    if (typeof callback === "function") {
      callback({ success: true, username });
    }

    console.log(`${username} joined the chat`);
  });

  socket.on("send_message", (rawMessage, callback) => {
    const username = users.get(socket.id);

    if (!username) {
      if (typeof callback === "function") {
        callback({
          success: false,
          message: "Join the chat before sending messages.",
        });
      }
      return;
    }

    const text =
      typeof rawMessage === "string" ? rawMessage.trim() : "";

    if (!text || text.length > MAX_MESSAGE_LENGTH) {
      if (typeof callback === "function") {
        callback({
          success: false,
          message: "Message must be between 1 and 1000 characters.",
        });
      }
      return;
    }

    const message = {
      id: `${socket.id}-${Date.now()}`,
      username,
      text,
      timestamp: new Date().toISOString(),
    };

    messageHistory.push(message);

    if (messageHistory.length > MAX_HISTORY) {
      messageHistory.shift();
    }

    io.emit("receive_message", message);

    if (typeof callback === "function") {
      callback({ success: true });
    }
  });

  socket.on("disconnect", () => {
    const username = users.get(socket.id);

    if (username) {
      users.delete(socket.id);

      socket.broadcast.emit("user_left", {
        username,
        message: `${username} left the chat`,
      });

      io.emit("online_users", Array.from(users.values()));

      console.log(`${username} disconnected`);
    } else {
      console.log(`Disconnected: ${socket.id}`);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});
