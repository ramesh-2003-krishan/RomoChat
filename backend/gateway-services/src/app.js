import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { apiLimiter } from './middleware/ratelimiter.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(apiLimiter);




export default app;