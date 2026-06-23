import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { apiLimiter } from './middleware/ratelimiter.js';
import authProxy from './routes/authProxy.js';
import { verifyToken } from './middleware/authMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(apiLimiter);


app.use("/api/auth", authProxy);

app.get("/", (req, res) => {
    res.json({
        service: "Gateway Service",
        status: "Running"
    });
});

app.get(
    "/api/protected",
    verifyToken,
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "Protected Route Accessed",
            user: req.user
        });

    }
);


export default app;