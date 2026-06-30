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