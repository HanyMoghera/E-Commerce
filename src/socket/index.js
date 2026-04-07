// src/socket/index.js
import { Message } from "../database/models/message.model.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export const initSocket = (server) => {
  // Attach Socket.io to the HTTP server
  io = new Server(server, {
    cors: {
      origin: "*", // allow all origins for testing
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Authenticate
    socket.on("authenticate", (token) => {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = payload;
        socket.isAdmin = payload.role === "admin";
        console.log(
          `User authenticated: ${payload._id}, admin: ${socket.isAdmin}`,
        );
      } catch (err) {
        console.log("Auth failed:", err.message);
        socket.disconnect();
      }
    });

    // Admin sends offer
    socket.on("admin:send-offer", async (data) => {
      if (!socket.isAdmin) return socket.emit("error", "Unauthorized");

      const newMessage = await Message.create({
        type: "offer",
        title: data.title,
        message: data.message,
        discountCode: data.discountCode,
        expiresAt: data.expiresAt,
      });

      // Broadcast to all non-admin authenticated users
      io.sockets.sockets.forEach((s) => {
        if (s.user && !s.isAdmin) {
          s.emit("user:receive-offer", newMessage);
        }
      });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
