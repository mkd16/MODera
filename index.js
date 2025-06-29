import dotenv from "dotenv"
import { connectDB } from "./DB/database.js"
import { logger } from "./utils/logger.js"
import { app } from "./app.js"

dotenv.config()
const PORT = process.env.PORT || 9001

await connectDB();

app.listen(PORT, ()=>{
    logger.info(`Server started listening on port ${PORT}`)
})
