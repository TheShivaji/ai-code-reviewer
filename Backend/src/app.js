import dotenv from "dotenv";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import reviewRouter from "./routes/review.routes.js";
const app = express();
dotenv.config();

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : ""
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

console.log(process.env.FRONTEND_URL)
app.use(express.json());
app.use(cookieParser());



app.use('/api/auth', authRouter)
app.use('/api/review', reviewRouter)




export default app;