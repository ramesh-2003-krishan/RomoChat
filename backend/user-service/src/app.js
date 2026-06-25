import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import userProxy from "./routes/userProxy.js";
import { verifyToken } from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        service: "User Service",
        status: "Running"
    });
});

app.use(
    "/api/users",
    verifyToken,
    userProxy
);

app.use("/", userRoutes);

export default app;