require('dotenv').config()

const jsonWebToken = require('jsonwebtoken')

const catchAsyncError = require('./catchAsyncError.js')
const ErrorHandler = require('../utils/errorHandler.js')

const { User } = require('../models')

const isAuthenticated = catchAsyncError(async (req, _res, next) => {
  const { token } = req.cookies

  if (!token) {
    return next(new ErrorHandler('You no loggging!login noew....', 401))
  }

  const decodeToken = await jsonWebToken.verify(
    token,
    process.env.SECRET_KEY_TOKEN
  )

  req.user = await User.findById(decodeToken.id)
  next()
})

const authorizeRoles = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 403))
    }

    next()
  }
}

const checkUser = catchAsyncError(async (req, _res, next) => {
  const { token } = req.cookies

  if (!token) {
    return next()
  }

  const decodedToken = await jwt.verify(token, process.env.SECRET_KEY_TOKEN)

  // @ts-ignore
  req.user = await User.findById(decodedToken.id)
  next()
})

module.exports = {
  authorizeRoles,
  isAuthenticated,
  checkUser,
}
