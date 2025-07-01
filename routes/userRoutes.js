import { Router } from "express";
import { registerUser, verifyUser } from "../controllers/user.js";

/* Function imports */

const userRouter = Router();

userRouter.route('/').get((req, res)=>{
    res.send('Working');
})

userRouter.route('/register').post(registerUser)
userRouter.route('/verify').post(verifyUser)

export { userRouter }