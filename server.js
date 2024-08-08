const express = require("express")
const WebSocket = require("ws")

const app = express()
const port = 8080

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

const wss = new WebSocket.Server({ server })

wss.on("connection", ws => {
  console.log("Client connected")

  ws.on("message", message => {
    console.log(`Received message => ${message}`)
    // Broadcast the message to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  })

  ws.on("close", () => {
    console.log("Client disconnected")
  })
})
