import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import reviewRouter from "./routes/review.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());



app.use('/api/auth' , authRouter)
app.use('/api/review' , reviewRouter)




export default app;