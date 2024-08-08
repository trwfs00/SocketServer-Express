const express = require("express")
const http = require("http")
const socketIo = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

io.on("connection", socket => {
  console.log("New client connected")

  socket.on("message", msg => {
    console.log(`Message received: ${msg}`)
    io.emit("message", msg) // Broadcast message to all clients
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected")
  })
})

const PORT = 8080
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
