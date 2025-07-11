/* 
REGISTER USER FLOW
    - check req.body
    - check for required fields and validate the fields
    - check for existing username and email
    - make an entry in DB 
    - send code for email verification 
    - maintain the token and expiry
    - send the response after removing password
    - then manage the rest verification and login in different controller/api endpoint......
 */

import { MSG_ERROR, MSG_SUCCESS } from "../constants.js"
import { User } from "../models/usersModel.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import validator from "validator"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { ApiResponse } from "../utils/ApiResponse.js"
import { sendEmail } from "../utils/sendEmail.js"
import { AuthToken } from "../models/authTokensModel.js"

const validateInput = function(field, value, required=false, makeLowerCase=false, trim=false, email=false){
    if(!email){
        value = validator.escape(value)
        if(makeLowerCase){
            value = value.toLowerCase()
        }
        if(trim){
            value = validator.trim(value)
        }
    } else {
        if(!validator.isEmail(value)){
            throw new ApiError(`${MSG_ERROR.INVALID_EMAIL}`, 400)
        }
        value = validator.trim(value).toLowerCase()
    }
    if(!value && required){
        throw new ApiError(`${field} ${MSG_ERROR.FIELD_REQUIRED}`, 400)
    }
    return value
}

const registerUser = async(req, res)=> {
    let returnData = {'success': true, data: {}}
    if(req.body && Object.keys(req.body).length > 0) {
        // input validation
        let { name, username, email, password } = req.body
        if([name, username, email, password].some( field => !field?.trim() )){
            throw new ApiError(`${MSG_ERROR.MISSING_FIELDS}`, 400)
        }

        name = validateInput('Name', name, true, false, true, false)
        username = validateInput('Username', username, true, true)
        email = validateInput('Email', email, true, true, true, true)

        if(!password || password.length < 6){
            throw new ApiError(`${MSG_ERROR.PASSWORD_LENGTH}`, 400)
        }
        password = await bcrypt.hash(password, 10)

        // existing user check
        let userExists = await User.findOne({
            $or: [{username}, {email}, {deleted: false}]
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

        sendEmailToUser(userDetails._id, email)
        
        returnData.data = userDetails
        new ApiResponse(`User ${MSG_SUCCESS.CREATED}`, returnData)
        .send(req, res)
    }
}

const matchToken = async(userId, token, type)=>{
    if(!userId || !token || !type){
        return false
    }
    const fetchToken = await AuthToken.findOne({
        $and: [{userId}, {used: false}, {type}]
    })
    const user = await User.findById(userId)
    if(!fetchToken) {
        if(type == 'verification'){
            if(user){
                if(!await User.findByIdAndUpdate(userId, {deleted: true})){
                    throw new ApiError(`${MSG_ERROR.SERVER} Please register again.`)
                }
            }
            throw new ApiError(`${MSG_ERROR.REGISTER}`)
        } else {
            throw new ApiError(`Token ${MSG_ERROR.MATCH}`, 400)
        }
    } else {
        if(Date.now() < new Date(fetchToken.expiry).getTime() && String(token) == String(fetchToken.token)) {
            if(!await AuthToken.findByIdAndUpdate(fetchToken._id, {used: true})) {
                throw new ApiError(`${MSG_ERROR.SERVER}`)
            }
            return true
        } else {
            if(Date.now() > new Date(fetchToken.expiry).getTime()){
                throw new ApiError(`${MSG_ERROR.EXPIRED}`)
            } else {
                throw new ApiError(`Code ${MSG_ERROR.MATCH}`)
            }
        }
    }
}

const verifyUser = async(req, res)=>{
    if(req.body && Object.keys(req.body).length > 0){
        const { code, _id } = req.body

        // check for user first
        const userId = _id
        const user = await User.findOne({
            _id: userId, 
            deleted: false,
        }).select('-password')

        if(!user) {
            throw new ApiError(`${MSG_ERROR.DOES_NOT_EXISTS}`)
        }

        if(matchToken(userId, code, 'verification')){
            if(!await User.findByIdAndUpdate(userId, {verified: true})){
                throw new ApiError(`${MSG_ERROR.SERVER}`)
            }
        } else {
            throw new ApiError(`${MSG_ERROR.SERVER}`, 500)
        }

        user.verified = true
        sendLoginUserResponse(user, req, res)
    }
}

const loginUser = async(req, res)=>{
    if(req.body && Object.keys(req.body).length > 0){
        const { username, password } = req.body
        if(!username || !password){
            if(!username){
                throw new ApiError(`Usernam ${MSG_ERROR.FIELD_REQUIRED}`)
            } else {
                throw new ApiError(`Password ${MSG_ERROR.FIELD_REQUIRED}`)
            }
        }

        const existingUser = await User.findOne({
            $or: [{username: username.toLowerCase()}, {email: username.toLowerCase()}, {deleted: false}]
        })

        if(!existingUser){
            throw new ApiError(`User ${MSG_ERROR.ALREADY_EXISTS}`)
        }
        if(!existingUser.verified) {
            throw new ApiError(`User ${MSG_ERROR.NOT_VERIFIED}`)
        }

        if(!await existingUser.isPasswordMatched(password)){
            throw new ApiError(`Password ${MSG_ERROR.MATCH}`)
        }

        sendLoginUserResponse(existingUser, req, res)
    }
}

const sendLoginUserResponse = async(user, req, res)=>{
    let returnData = {'success': true, data: {}}
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user)
    const options = {
        httpOnly: true,
        secure: true
    }

    returnData.data = user
    new ApiResponse(`${MSG_SUCCESS.LOGGED_IN}`, returnData, 200)
    .setCookies('accessToken', accessToken, options)
    .setCookies('refreshToken', refreshToken, options)
    .send(req, res)
}

const generateAccessAndRefreshToken = async(user)=>{
    try {
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        const tokenInfo = await AuthToken.create({
            userId: user._id,
            type: 'refresh_token',
            token: refreshToken,
        })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(`${MSG_ERROR.SERVER} While generating tokens.`)
    }
}

const logoutUser = async(req, res)=>{
    let returnData = {'success': true, data: {}}
    await AuthToken.findOneAndUpdate({
        userId: req.verifiedUser._id,
        type: 'refresh_token',
        used: false
    }, {
        used: true
    }, {
        new: true
    })
    const options = {
        httpOnly: true,
        secure: true
    }
    new ApiResponse(`${MSG_SUCCESS.LOGGED_OUT}`, returnData, 200)
    .clearCookies('accessToken', options)
    .clearCookies('refreshToken', options)
    .send(req, res)
}

const sendEmailToUser = async function(userId, email, type='verification'){
    let subject = ''
    let token = ''
    let html = ''
    if(type == 'verification'){
        token = Math.floor(1000 + (Math.random()*9000))
        html = `<div style="font-family:sans-seriftext-align:center;"><h2>Verify Your Email</h2><p>Your code is:</p><div style="font-size:32px;font-weight:bold;color:#1a73e8;">${twofa}</div><p>Valid for 10 minutes.</p></div>`;
        subject = 'MODera Verification Code.'
    } else {
        token = crypto.randomBytes(32).toString('hex')
        const resetLink = `http://localhost:9000/api/users/updateUserPassword?token=${token}&id=${userId}`;
        html = `<div style="font-family:sans-serif;text-align:center;"><h2>Reset your MODera password.</h2><p>Click the link below to set a new password.</p><div style="font-size:16px;font-weight:bold;color:#1a73e8;"><a href="${resetLink}">Reset Password</a></div><p>Valid for 10 minutes.</p></div>`;
        subject = 'MODera Reset Password.'
    }

    sendEmail({
        to: email,
        subject,
        html
    })

    if(type!='verification'){
        token = crypto.createHash('sha256').update(token).digest('hex')
    }

    const tokenExpiry = new Date(Date.now() + 10*60*1000)
    const tokenInfo = await AuthToken.create({
        userId: userId,
        type,
        token,
        expiry: tokenExpiry,
    })
    return true
}

const updateUserProfile = async(req, res)=>{
    let returnData = {'success': true, data: {}}
    const field = req.body?.field
    let value = req.body?.value
    if(!field || value == undefined){
        throw new ApiError(`Field ${MSG_ERROR.FIELD_REQUIRED}`, 400)
    }
    if(field == 'email'){
        value = validateInput('Email', value, true, true, true, true)
        data = {
            action: 'email update'
        }
        returnData.data = data
        if(sendEmailToUser(req.body.verifiedUser._id, value)){
            new ApiResponse(`${MSG_SUCCESS.VERIFICATION_EMAIL}`, returnData, 200)
            .send(req, res)
        }
    } else {
        value = validateInput(field, value, true, true, true, false)
    }
    const updatedUser = await User.findByIdAndUpdate(req.verifiedUser._id, {
        [field]: value
    }, {
        new : true
    }).select('-password')

    if(!updatedUser){
        throw new ApiError(`${MSG_ERROR.SERVER}`, 500)
    }
    returnData.data = updatedUser
    new ApiResponse(`${MSG_SUCCESS.USER_UPDATED}`, returnData, 200)
    .send(req, res);
}

const updateUserPassword = async(req, res)=>{
    let returnData = {'success': true, data: {}}
    const type = req.body?.type
    if(!type){
        throw new ApiError(`${MSG_ERROR.GENERAL}`, 400)
    }
    const newPassword = req.body?.newPassword
    const confirmPassword = req.body?.confirmPassword
    if(!newPassword || !confirmPassword){
        throw new ApiError(`Password ${MSG_ERROR.MATCH}`, 400)
    }
    if(newPassword.length < 6){
        throw new ApiError(`Password ${MSG_ERROR.PASSWORD_LENGTH}`, 400)
    }
    if(type != 'change'){
        const token = req.body?.token
        const userId = req.body.userId
        if(!token || !userId){
            throw new ApiError(`${MSG_ERROR.GENERAL}`, 400)
        }
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
        if(!matchToken(userId, hashedToken, 'forgot_password')){
            throw new ApiError(`${MSG_ERROR.SERVER}`, 500)
        }
        const user = await User.findById(userId).select('-password')
        req.body.verifiedUser = user
    }
    
    if(newPassword == confirmPassword){
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.body.verifiedUser._id, 
            {
                password: hashedPassword
            }
        )
        new ApiResponse(`${MSG_SUCCESS.USER_PASSWORD_UPDATE}`, returnData, 200)
        .send(req, res)
    }
    throw new ApiError(`Password ${MSG_ERROR.MATCH}`, 400)
}

const forgotPassword = async(req, res)=>{
    let returnData = {'success': true, data: {}}
    let email = req.body?.email
    if(!email){
        throw new ApiError(`${MSG_ERROR.MISSING_FIELDS}`, 400)
    }
    email = validateInput('Email', email, true, true, true, true)
    const user = await User.findOne({email}).select('-password')
    if(!user){
        throw new ApiError(`${MSG_ERROR.DOES_NOT_EXISTS}`)
    }
    sendEmailToUser(user._id, email, 'forgot_password')
    new ApiResponse(`${MSG_SUCCESS.RESET_PASSWORD_EMAIL}`, returnData, 200)
    .send(req, res)
}

export { 
    registerUser, 
    verifyUser, 
    loginUser, 
    logoutUser, 
    updateUserProfile, 
    updateUserPassword, 
    forgotPassword 
}

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