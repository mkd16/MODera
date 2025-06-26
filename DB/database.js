import mongoose from "mongoose"
import { MSG_DB } from "../constants.js"

/* DB Connection */
export const connectDB = async function (){
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${MSG_DB.DB_NAME}`)
        console.log('Connected')
    } catch (error) {
        console.log(`${MSG_DB.FAILED_DB_CONNECTION} \n ${error.message}`)
    }
}