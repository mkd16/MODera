import { Router } from "express";
import { registerUser, verifyUser } from "../controllers/user.js";

export const userRouter = Router();

userRouter.route('/').get((req, res)=>{
    res.send('Working');
})

userRouter.route('/register').post(registerUser)
userRouter.route('/verify').post(verifyUser)