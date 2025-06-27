import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./DB/database.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import morgan from "morgan"
import { logger } from "./utils/logger.js"
import helmet from "helmet"

dotenv.config()
const PORT = process.env.PORT || 9001

const app = express()

await connectDB();

/* middlewares */
app.use(helmet())
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

/* Routing */
import { userRouter } from "./routes/userRoutes.js"
app.use("/api/users/", userRouter)

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