import { createLogger, format, transports } from "winston";
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename);

const logDir = path.join(__dirname, '../logs');
if(!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
}

export const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({timestamp, level, message})=>{
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: path.join(__dirname, '../logs', 'combined.log')}),
        new transports.File({filename: path.join(__dirname, '../logs', 'error.log'), level: 'error'}),
    ]
})


/* -------------------------------------------------------------------------------------------
NOTES:
    1. __dirname is not globally present in ES Modules.
    2. import.meta.url :: provides us :: file:///Users/you/project/logger/logger.js
    3. this is __filename (full file path url)
    4. in order to convert it into path from url, we use :: fileURLToPath :: /Users/you/project/logger/index.js
    5. in order to fetch the directory only, we use :: path.directory(__filename) :: /Users/you/project/logger
    6. format.timestamp():: lets you add timestamp to the log message :: makes timestamp available in logger
*/