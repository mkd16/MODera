import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./DB/database.js"
import { asyncHandler } from "./utils/asyncHandler.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import morgan from "morgan"
import { logger } from "./utils/logger.js"
import { ApiError } from "./utils/ApiError.js"
import { ApiResponse } from "./utils/ApiResponse.js"

dotenv.config()
const PORT = process.env.PORT || 9001

const app = express()

await connectDB();

/* middlewares */
app.use(express.json())
app.use(express.urlencoded({extended: true}))

/* piping morgan with winston */
app.use(morgan('combined', {
    stream: {
        write: (message)=>{
            logger.info(message)
        }
    }
}));

/* routes */
app.get('/', asyncHandler((req, res)=>{
    const response = new ApiResponse(200, 'Success class testing', null, logger)
    response.send(req, res)
}))
app.get('/error', asyncHandler((req, res)=>{
    throw new ApiError(500, 'Error class testing', logger)
    res.send('Error response')
}))

/* global error handler */
app.use(errorHandler)

app.listen(PORT, ()=>{
    logger.info(`Server started listening on port ${PORT}`)
})



/*------------------------------------------------------------------------------------------- 
NOTES: 
1. req
    Property	        Description

    req.method	        HTTP method (e.g. "POST")
    req.url	            Request URL path
    req.headers     	HTTP headers object
    req.body        	(Undefined by default — set by middleware)
    req.query       	URL query params (?key=value)
    req.params      	Route parameters (/user/:id → req.params.id)
    req.cookies     	(If using cookie-parser)
    req.rawHeaders      Raw headers array 
*/