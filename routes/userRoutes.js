import { Router } from "express";
import { 
    registerUser, 
    verifyUser, 
    loginUser, 
    logoutUser, 
    updateUserProfile, 
    updateUserPassword, 
    forgotPassword 
} from "../controllers/users.js";
import { isAuthenticated } from "../middlewares/auth.js";

/* Function imports */

const userRouter = Router();

userRouter.route('/').get((req, res)=>{
    res.send('Working');
})

userRouter.route('/register').post(registerUser)
userRouter.route('/verify').post(verifyUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(isAuthenticated, logoutUser)
userRouter.route('/updateProfile').post(isAuthenticated, updateUserProfile)
userRouter.route('/updatePassword').post(isAuthenticated, updateUserPassword)
userRouter.route('/forgotPassword').post(forgotPassword)

export { userRouter }
