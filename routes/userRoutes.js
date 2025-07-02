import { Router } from "express";
import { registerUser, verifyUser, loginUser } from "../controllers/users.js";

export const userRouter = Router();

userRouter.route('/').get((req, res)=>{
    res.send('Working');
})

userRouter.route('/register').post(registerUser)
userRouter.route('/verify').post(verifyUser)
userRouter.route('/login').post(loginUser)