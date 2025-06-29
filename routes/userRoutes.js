import { Router } from "express";

export const userRouter = Router();

userRouter.route('/').get((req, res)=>{
    res.send('Working');
})