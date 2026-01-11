import { Server } from "socket.io"
import http from "http"
import express from "express"
import { Pool } from 'pg';

export const app = express()
export const server = http.createServer(app)
export const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT"]
  },
})

export async function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
})