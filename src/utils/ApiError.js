class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        error =[],
        statck=""
    ){
        super(message)
        this.statusCode = statusCode
        this.errors = error
        this.data = null
        this.success = null
        this.message= message

        if(statck)
        {
            this.stack= statck
        }
        else
        {
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}