const ErrorHandler = require('../utils/errorHandler')
const loggerWinston = require('./loggerWinton.binh.dev')

const errorHandlerMiddleware = (err, req, res, next) => {
  err.code = err.code || 500
  err.message = err.message || 'Error server internal'

  if (err.name === 'CastError') {
    const message = 'Resource not found Invalid:' + err.path
    err = new ErrorHandler(message, 404)
  }

  if (err.code === 11000) {
    const message = 'email is doulecap'
    err = new ErrorHandler(message, 400)
  }

  if (err.name === 'jsonWebTokenError') {
    const message = 'Json web token is valid try again.'
    err = new ErrorHandler(message, 400)
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'TokenExpiredError.'
    err = new ErrorHandler(message, 400)
  }
  loggerWinston.error(err.message, err)

  return res.status(err.code).json({
    success: false,
    message: err.message,
    code: err.code,
  })
}

module.exports = errorHandlerMiddleware
