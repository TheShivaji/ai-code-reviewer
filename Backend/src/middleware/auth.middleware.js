import jwt from "jsonwebtoken"

export const authUser = async(req , res , next) => { 
    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        req.user = decode.id
        next()
    }catch(error){
        res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }
}