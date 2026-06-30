import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import socketAuth from "./middleware/socketAuth.js";
import onlineUserService from "./services/onlineUserService.js";

import app from "./app.js";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.set("io", io);

io.use(socketAuth);

io.on("connection", (socket) => {

    const userId = socket.user.userId;

    onlineUserService.addUser(
        userId,
        socket.id
    );

    console.log(`${userId} connected`);

    console.log(
        onlineUserService.getOnlineUsers()
    );

    socket.on("join_room", async ({ conversationId }, callback) => {
        try {
            if (!conversationId) {
                if (typeof callback === "function") {
                    return callback({ success: false, message: "conversationId is required" });
                }
                return socket.emit("join_room_error", { message: "conversationId is required" });
            }

            // Security Check: Verify that user is a participant of the conversation
            const chatServiceUrl = process.env.CHAT_SERVICE_URL || "http://localhost:5003";
            const response = await fetch(`${chatServiceUrl}/conversations/${conversationId}`, {
                method: "GET",
                headers: {
                    "x-user-id": userId
                }
            });

            if (!response.ok) {
                if (typeof callback === "function") {
                    return callback({ success: false, message: "Unauthorized or conversation not found" });
                }
                return socket.emit("join_room_error", {
                    conversationId,
                    message: "Unauthorized or conversation not found"
                });
            }

            socket.join(conversationId);
            console.log(`User ${userId} joined room: ${conversationId}`);

            if (typeof callback === "function") {
                callback({ success: true, message: `Joined room: ${conversationId}` });
            }

            socket.emit("joined_room", { conversationId });

        } catch (error) {
            console.error(`Error joining room ${conversationId}:`, error);
            if (typeof callback === "function") {
                callback({ success: false, message: "Server error joining room" });
            }
            socket.emit("join_room_error", {
                conversationId,
                message: "Server error joining room"
            });
        }
    });

    socket.on("disconnect", () => {

        onlineUserService.removeUser(
            userId,
            socket.id
        );

        console.log(`${userId} disconnected`);

        console.log(
            onlineUserService.getOnlineUsers()
        );

    });

});