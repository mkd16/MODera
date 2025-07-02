import { logger } from "./logger.js"

class ApiResponse {
    constructor(message='Succcess', data=null, statusCode=200){
        this.data       = data
        this.message    = message
        this.statusCode = statusCode
        this.cookies = []
    }
    
    setCookies({name, value, options={}}){
        this.cookies.push({name, value, options})
        return this
    }

    send(req, res){
        for(const {name, value, options} of this.cookies){
            res.cookie(name, value, options)
        }

        logger.info(`[RESPONSE] ${this.statusCode} :: ${req.method} :: ${req.url} :: ${this.message}`)
        res.status(this.statusCode).json({
            success : true,
            message : this.message,
            data    : this.data
        })
    }
}

export {ApiResponse}


/* 
NOTES:
    - for in:  iterates over keys/property names,  PREFFERED for object iterations and not for array
    - for in:   iterates over values,  PREFFERED for iterables like array, string, map, nodelist, set
 */