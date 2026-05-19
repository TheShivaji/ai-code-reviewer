import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


/**
 @http://localhost:3000/api/auth/register    
 */
app.use('/api/auth' , authRouter)




export default app;