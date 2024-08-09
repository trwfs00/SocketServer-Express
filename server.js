const express = require("express");
const WebSocket = require("ws");

const app = express();
const port = 8080;

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const wss = new WebSocket.Server({ server });
const rooms = {};

wss.on("connection", ws => {
  console.log("Client connected");
  ws.room = "default-room";  // Default room

  ws.on("message", message => {
    try {
      const data = JSON.parse(message);

      if (data.action === "join" && data.room) {
        const oldRoom = ws.room;
        ws.room = data.room;
        
        if (rooms[oldRoom]) {
          rooms[oldRoom] = rooms[oldRoom].filter(client => client !== ws);
        }
        
        if (!rooms[ws.room]) {
          rooms[ws.room] = [];
        }
        rooms[ws.room].push(ws);

        console.log(`Client joined room: ${ws.room}`);
      }
    } catch (error) {
      console.log(`Received message => ${message}`);

      if (rooms[ws.room]) {
        rooms[ws.room].forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (rooms[ws.room]) {
      rooms[ws.room] = rooms[ws.room].filter(client => client !== ws);
    }
  });
});
