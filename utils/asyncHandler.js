export const asyncHandler = (fn) => {
    return (req, res, next)=>{
        Promise.resolve().then(
            fn(req, res, next)
        ).catch(next)
    }
}

/* -------------------------------------------------------------------------------------------
NOTES:
    1. This just wraps the fn into promise.
    2. We do so to follow DRY and do not mess in every request to add try-catch in routes.
    3. It just returns the function wrapped in promise and do executes.
    4. Only executes the already wrapped function when route it hit.
    5. catch(next) is shortcut to -- catch(err => next(err))
    6. 
        const p = Promise.resolve("first");
        p.then(() => {
        throw new Error("Boom");  // This throws
        }).catch(err => {
        console.log("Caught:", err.message); // ✅ Will catch "Boom"
        });
*/