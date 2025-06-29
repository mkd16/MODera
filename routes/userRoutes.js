import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { upload } from "../middlewares/upload.js"

/* Function imports */

const checkMark = '\u2714';
const errorMark = '\u274C';
const userRouter = Router();

userRouter.route('/').get(asyncHandler((req, res)=>{
    const response = new ApiResponse(`Users root route.${checkMark}`)
    response.send(req, res);
}));

// userRouter.route('/register', upload.single(), )

export { userRouter }