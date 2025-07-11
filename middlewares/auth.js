import { MSG_ERROR } from "../constants.js";
import { User } from "../models/usersModel.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"

const isAuthenticated = async(req, res, next)=>{
    try {
        const token = req.cookies?.accessToken || req.headers?.authorization.replace('Bearer ', '');
        if(!token){
            throw new ApiError(`${MSG_ERROR.UNAUTHORIZED}`, 401)
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if(!decodedToken && !decodedToken._id) {
            throw new ApiError(`${MSG_ERROR.UNAUTHORIZED}`, 401)
        }
        const user = await User.findById(decodedToken._id).select('-password')
    
        if(!user){
            throw new ApiError(`${MSG_ERROR.DOES_NOT_EXISTS}`)
        }
        req.verifiedUser = user
        next()
    } catch (error) {
        throw new ApiError(`${MSG_ERROR.UNAUTHORIZED}`, 401)
    }
}

export { isAuthenticated }