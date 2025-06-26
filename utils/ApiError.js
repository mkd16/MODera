import { MSG_ERROR } from "../constants.js"

class ApiError extends Error {
    constructor(statusCode = 500, message, logger){
        super(message)
        this.data       = null
        this.message    = message || MSG_ERROR.SERVER_ERROR
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)

        if(logger){
            this.logger = logger
        }
    }
}

export { ApiError }