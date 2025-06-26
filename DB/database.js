import mongoose from "mongoose"
import { MSG_DB } from "../constants.js"
import { logger } from "../utils/logger.js"

/* DB Connection */
export const connectDB = async function (){
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${MSG_DB.DB_NAME}`)
        logger.info(`Database Connected.`)
    } catch (error) {
        logger.error(`${MSG_DB.FAILED_DB_CONNECTION} \n ${error.message}`)
    }
}