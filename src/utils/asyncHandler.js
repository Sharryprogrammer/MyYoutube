const asyncHandler = (requestHandler) => {
    (err,req,res,next) => {
        Promise.resolve(requestHandler(err,req,res,next))
        .catch((err) => next(err))
    }
}

export {asyncHandler}