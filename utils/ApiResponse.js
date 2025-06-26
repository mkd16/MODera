class ApiResponse {
    constructor(statusCode=200, message='Succcess', data=null, logger=null){
        this.data       = data
        this.message    = message
        this.statusCode = statusCode

        if(logger){
            this.logger = logger
        }
    }
    
    send(req, res){
        if(this.logger){
            this.logger.info(`[RESPONSE] ${this.statusCode} :: ${req.method} :: ${req.url} :: ${this.message}`)
        }
        res.status(this.statusCode).json({
            success : true,
            message : this.message,
            data    : this.data
        })
    }
}

export {ApiResponse}