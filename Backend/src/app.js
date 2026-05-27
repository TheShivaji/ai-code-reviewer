import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import reviewRouter from "./routes/review.routes.js";
const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "https://ai-code-reviewer.theshivaji.in"
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
    const cleaned = process.env.FRONTEND_URL.replace(/\/$/, "");
    if (!allowedOrigins.includes(cleaned)) {
        allowedOrigins.push(cleaned);
    }
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());



app.use('/api/auth' , authRouter)
app.use('/api/review' , reviewRouter)




export default app;