import { MSG_ERROR } from "../constants.js"
import { logger } from "../utils/logger.js"

export const errorHandler = function(err, req, res, next) {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || MSG_ERROR.SERVER_ERROR,
        ...(process.env.IS_DEV && err.stack && {stack: err.stack})
    })
    
    logger.error(`[RESPONSE] ${err.statusCode} :: ${req.method} :: ${req.url} :: ${err.message}`)
}


/*------------------------------------------------------------------------------------------- 
NOTES: 
    1. ... => spread operator
    2. 
        const obj1 = { name: "Alice" };
        const obj2 = { age: 30 };
        const result = { ...obj1, ...obj2 };
    3. When spread operator used over nested object/array
        const original = {
            name: "John",
            address: {
            city: "Delhi"
            }
        };
        const copy = { ...original };
        copy.address.city = "Mumbai";
        console.log(original.address.city); // ❗ "Mumbai"
    4. Can be used for strings
        const a = [1, 2];
        const b = "hello";
        const combined = [...a, ...b];
        console.log(combined); // [1, 2, 'h', 'e', 'l', 'l', 'o']
*/