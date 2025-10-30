// server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// ✅ Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Handle root route explicitly
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ WebSocket server logic
wss.on("connection", (ws) => {
  console.log("🔗 New WebSocket connection");

  ws.on("message", (message) => {
    console.log("📩 Received:", message.toString());

    // Broadcast message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => console.log("❌ Client disconnected"));
});

// ✅ Use Fly.io's provided PORT
const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});