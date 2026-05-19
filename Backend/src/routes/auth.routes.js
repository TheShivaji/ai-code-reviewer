import { Router  } from "express";
import { userRegister , Login } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router()

authRouter.post('/register' ,userRegister )
authRouter.post('/login'  , Login )

export default authRouter