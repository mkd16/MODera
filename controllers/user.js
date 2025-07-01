/* 
FLOW
    - check req.body
    - check for required fields and validate the fields
    - check for existing username and email
    - make an entry in DB 
    - send code for email verification 
    - maintain the token and expiry
    - send the response after removing password
    - then manage the rest verification and login in different controller/api endpoint......
 */

import { MSG_ERROR, MSG_SUCCESS } from "../constants.js";
import { User } from "../models/usersModel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validator from "validator"
import bcrypt from "bcrypt"
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";
import { AuthToken } from "../models/authTokensModel.js";

const registerUser = asyncHandler(async(req, res)=> {
    if(req.body && Object.keys(req.body).length > 0) {
        // input validation
        let { name, username, email, password } = req.body;
        if([name, username, email, password].some( field => !field?.trim() )){
            throw new ApiError(`${MSG_ERROR.MISSING_FIELDS}`, 400)
        }

        name = validator.escape(name);
        username = validator.escape(username);
        if(!validator.isEmail(email)){
            throw new ApiError(`${MSG_ERROR.INVALID_EMAIL}`, 400)
        }
        email = validator.trim(email).toLowerCase();
        if(!password || password.length < 6){
            throw new ApiError(`${MSG_ERROR.PASSWORD_LENGTH}`, 400)
        }
        password = await bcrypt.hash(password, 10);

        // existing user check
        let userExists = await User.findOne({
            $or: [{username}, {email}]
        })
        if(userExists) {
            throw new ApiError(`User ${MSG_ERROR.ALREADY_EXISTS}`, 409)
        }

        // create user
        const user = await User.create({
            name,
            username: username.toLowerCase(),
            email,
            password
        })
        if(!user){
            throw new ApiError(`${MSG_ERROR.SERVER}`)
        }
        const userDetails = await User.findById(user._id).select('-password')

        const twofa = Math.floor(1000 + (Math.random()*9000))
        const html = `<div style="font-family:sans-serif;text-align:center;"><h2>Verify Your Email</h2><p>Your code is:</p><div style="font-size:32px;font-weight:bold;color:#1a73e8;">${twofa}</div><p>Valid for 10 minutes.</p></div>`;
        
        try {
            sendEmail({
                to: email,
                subject: 'MODera Verification Code',
                html
            })
        } catch (error) {
            throw new ApiError(`${MSG_ERROR.EMAIL_FAILED}`)
        }

        const tokenExpiry = new Date(Date.now() + 10*60*1000)
        // insert token 
        const tokenInfo = await AuthToken.create({
            userId: userDetails._id,
            type: 'verification',
            token: twofa,
            expiry: tokenExpiry,
        })
        
        const response = new ApiResponse(`User ${MSG_SUCCESS.CREATED}`, userDetails)
        response.send(req, res)
    }
})

const verifyUser = asyncHandler(async(req, res)=>{
    if(req.body && Object.keys(req.body).length > 0){
        const { code, _id } = req.body;

        // check for user first
        const userId = _id
        const user = await User.findOne({
            _id: userId, 
            deleted: false,
        }).select('-password')

        if(!user) {
            throw new ApiError(`User ${MSG_ERROR.DOES_NOT_EXISTS}`);
        }

        const fetchToken = await AuthToken.findOne({
            $and: [{userId}, {used: false}, {type: 'verification'}]
        })

        if(!fetchToken) {
            if(user){
                if(!await User.findByIdAndDelete(userId)){
                    throw new ApiError(`${MSG_ERROR.SERVER}`)
                }
            }
            throw new ApiError(`${MSG_ERROR.REGISTER}`)
        } else {
            if(Date.now() < new Date(fetchToken.expiry).getTime() && String(code) == String(fetchToken.token)) {
                if(!await User.findByIdAndUpdate(userId, {verified: true})){
                    throw new ApiError(`${MSG_ERROR.SERVER}`)
                }
                if(!await AuthToken.findByIdAndUpdate(fetchToken._id, {used: true})) {
                    throw new ApiError(`${MSG_ERROR.SERVER}`)
                }
            } else {
                if(Date.now() > new Date(fetchToken.expiry).getTime()){
                    throw new ApiError(`${MSG_ERROR.EXPIRED}`)
                } else {
                    throw new ApiError(`Code ${MSG_ERROR.MATCH}`)
                }

            }
        }

        const response = new ApiResponse(`User ${MSG_SUCCESS.VERIFIED}`, user);
        response.send(req, res);
    }
})

export { registerUser, verifyUser }

/* 
NOTES
    - ?. (optional chaining operator) => skips undefined or null fields or variables ==> do not gives error
    - .some => checks if any item matches the condition and breaks. (.every, .filter, .reduce, .map, .find, .includes)
    - { $or: [ { username: 'mohit' }, { email: 'mohit@example.com' } ] }
    - | Code               | When to Use                                    |
      | ------------------ | ---------------------------------------------- |
      | `400 Bad Request`  | Missing or malformed fields                    |
      | `401 Unauthorized` | Login required                                 |
      | `403 Forbidden`    | Valid token but not enough rights              |
      | `404 Not Found`    | Resource doesn’t exist                         |
      | `409 Conflict`     | **Duplicate data** — e.g., existing user/email |

*/