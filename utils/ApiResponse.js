import { logger } from "./logger.js"

class ApiResponse {
    constructor(message='Succcess', data=null, statusCode=200){
        this.data       = data
        this.message    = message
        this.statusCode = statusCode
    }
    
    send(req, res){
        logger.info(`[RESPONSE] ${this.statusCode} :: ${req.method} :: ${req.url} :: ${this.message}`)
        res.status(this.statusCode).json({
            success : true,
            message : this.message,
            data    : this.data
        })
    }
}

export {ApiResponse}