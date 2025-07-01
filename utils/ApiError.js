import { MSG_ERROR } from "../constants.js"

class ApiError extends Error {
    constructor(message, statusCode = 500){
        super(message)
        this.data       = null
        this.message    = message || MSG_ERROR.SERVER
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}

export { ApiError }