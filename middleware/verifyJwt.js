import jsonwebtoken from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const isAuthenticate = (async (req, resp, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        
    if (!token) {
        msg:"Token is require"
    }
    const verifiedToken = await jsonwebtoken.verify(token, "jwtsecretkey")
    req.user= await User.findById(verifiedToken._id)
   
    next()     
    } catch (error) {
        resp.status(404).json({
            masg:"Unauthorized token"
        })
    }
   
})