import dotenv from "dotenv";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import reviewRouter from "./routes/review.routes.js";
const app = express();
dotenv.config();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

console.log(process.env.FRONTEND_URL)
app.use(express.json());
app.use(cookieParser());



app.use('/api/auth', authRouter)
app.use('/api/review', reviewRouter)




export default app;