import { Router  } from "express";
import { userRegister , Login , logout , getUser } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router()

authRouter.post('/register' ,userRegister )
authRouter.post('/login'  , Login )
authRouter.get('/logout' , authUser , logout)
authRouter.get('/user' , authUser , getUser)

export default authRouter