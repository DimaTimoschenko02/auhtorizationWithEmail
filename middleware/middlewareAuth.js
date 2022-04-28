const UserService = require('../service/userService')
const ApiError = require('../exeptions/apiErrors')


module.exports = function(req, res, next){
    try{
        const headerToken = req.headers.authorization
        if(!headerToken){
            console.log('headertok')
            return next(ApiError.UnauthorizedError())
        }
        const accessToken = headerToken.split(' ')[1]
        if(!accessToken){
            console.log('access')
            return next(ApiError.UnauthorizedError())
        }
        const isValid = UserService.validateAccessToken(accessToken)
        if(!isValid){
            console.log('isValid')
            return next(ApiError.UnauthorizedError())
        }
        req.user = isValid
        next()
    }catch(e){
        return next(ApiError.UnauthorizedError())
    }

}