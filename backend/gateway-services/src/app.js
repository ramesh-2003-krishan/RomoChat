import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { apiLimiter } from './middleware/ratelimiter.js';
import authProxy from './routes/authProxy.js';

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



export default app;