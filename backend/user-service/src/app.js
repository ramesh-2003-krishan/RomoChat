import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import { extractUser } from "./middlewares/authMiddleware.js";

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

app.use("/", extractUser, userRoutes);

export default app;