import express from "express";
import cors from "cors";
import morgan from "morgan";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/", chatRoutes);
app.use("/", messageRoutes);

app.get("/", (req, res) => {
res.json({
service: "Chat Service",
status: "Running"

});
});

export default app;