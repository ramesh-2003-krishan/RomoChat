import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {

    console.log(`Client Connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Client Disconnected: ${socket.id}`);
    });

});

const PORT = process.env.PORT || 5004;

server.listen(PORT, () => {
    console.log(`Realtime Service running on port ${PORT}`);
});