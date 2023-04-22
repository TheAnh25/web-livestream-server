const crypto = require('crypto')
const cloudinary = require('cloudinary')

const {User, Streammer} = require('../models')

const catchAsyncError = require('../middleware/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwtToken')
const {sendMail} = require('../utils/sendMailChangeOrForgotPassword')
const streammerModel = require('../models/streammer.model')

const register = catchAsyncError(async (req, res, next) => {
  const {username, password, email} = req.body

  if (!req.body.avatar) {
    const user = new User({
      ...req.body,
    })

    await user.save()

    return sendToken(user, 200, res)
  }

  const myCloud = await cloudinary.v2.uploader(req.body.avatar, {
    folder: 'avatars_web_stream',
    width: 150,
    crop: 'scale',
  })

  const user = new User.create({
    username,
    password,
    email,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.url,
    },
  })

  return sendToken(user, 200, res)
})

const login = catchAsyncError(async (req, res, next) => {
  const {email, password} = req.body

  if (!email || !password) {
    return next(new ErrorHandler('Please enter your email/password...', 400))
  }

  const user = await User.findOne({email}).select('+password')

  if (!user) {
    return next(new ErrorHandler('Wrong email or password', 404))
  }

  const isPasswordMatched = await user.comparePassword(password)
  user.last_login = new Date(Date.now())
  user.count_login += 1

  await user.save()

  if (!isPasswordMatched) {
    return next(new ErrorHandler('wrong enmail or password...', 400))
  }

  sendToken(user, 200, res)
})

const logout = catchAsyncError(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: 'logout successfully',
  })
})

const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({email: req.body.email})
  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  const tokenReset = await user.getResetPasswordToken()
  await user.save({validateBeforeSave: false})

  // const resetPasswordUrl = `${req.protocol}://${req.get('host')}/${resetToken}`

  const resetPasswordUrl = `http://localhost:3000/reset-password/${tokenReset}`

  const message = `Your password reset token is <a href="${resetPasswordUrl}">Click</a> here`

  try {
    await sendMail({
      email: user.email,
      suject: 'web-stream-apb',
      message: `<b>Changepassword Links ${message}</b>`,
      html: `<b>Changepassword Link: ${message}</b>`,
    })

    return res.status(200).json({
      success: true,
      message,
      email: user.email,
      suject: 'web-stream-apb',
      html: `<b>Changepassword Link: </b>${message}`,
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save({validateBeforeSave: false})

    return next(new ErrorHandler('server internal: ' + error.message, 500))
  }
})

const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordExpires: {$gt: Date.now()},
    resetPasswordToken,
  })

  if (!user) {
    return next(new ErrorHandler('User not found or not loggin in', 404))
  }

  console.log(req.body)
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler('Confirm password not matched', 400))
  }

  user.password = req.body.newPassword

  await user.save()

  sendToken(user, 200, res)
})

const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    email: req.body.email,
    username: req.body.username,
  }

  const userExit = await User.findById(req.user.id)

  if (!userExit) {
    return next(new ErrorHandler('user not found', 404))
  }

  if (req.body.avatar !== undefined) {
    const imageId = userExit.avatar.public_id

    if (imageId) await cloudinary.v2.uploader.destroy(imageId)
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'avatars_web_stream',
      width: 150,
      crop: 'scale',
    })

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    }
  }

  req.birthday = new Date(req.birthday)
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {...req.body, avatar: {...newUserData.avatar}},
    {
      new: true,
      runValidators: true,
    }
  )
  res.status(200).json({
    success: true,
    user,
    message: 'Update profile successfully',
  })
})

const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  if (!user) next(new ErrorHandler('User not found or you not logged in', 404))

  delete user.password

  res.status(200).json({
    user,
    message: 'get user sucessfully',
    success: true,
  })
})

const getSigleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) next(new ErrorHandler('User not found or you not logged in', 404))

  delete user.password

  res.status(200).json({
    user,
    message: 'get user sucessfully',
    success: true,
  })
})

const updatedUserRole = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) next(new ErrorHandler('User not found or you not logged in', 404))

  if (!req.body.isUserUpdateRole) {
    return res.status(200).json({
      success: false,
      message: 'update role fail',
    })
  }

  user.role = req.body.role
  await user.save()
  delete user.password

  return res.status(200).json({
    success: true,
    user,
    message: 'update role successfully',
  })
})

// not use
const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return next(new ErrorHandler('user not found', 404))
  }

  const imageId = user?.avatar?.public_id

  await cloundinary.v2.uploader.destroy(imageId)

  await user.remove()

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  })
})

const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  if (
    !req.body.oldPassword ||
    !req.body.newPassword ||
    !req.body.confirmPassword
  )
    next(new ErrorHandler('All field is required', 400))

  if (!req.body.oldPassword)
    next(new ErrorHandler('oldPassword is required', 400))
  const isPasswordMatched = await user?.comparePassword(req.body.oldPassword)

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Old password is incorrect', 400))
  }

  console.log(req.body)

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password not match', 400))
  }

  if (user) {
    user.password = req.body.newPassword

    await user.save()
  }

  sendToken(user, 200, res)
})

const getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find({})

  return res.status(200).json({
    success: true,
    users,
    message: 'get all user successfully',
  })
})

const registerStreammer = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  if (user.isStreammer)
    res.status(400).json({success: fasle, message: 'user is register 1 more'})

  const {imgs, thumbnails} = req.body
  const temp = {}
  if (!imgs || !thumbnails)
    next(new ErrorHandler('imgs and thumbnail are required', 400))

  const imglUploadRes = await cloudinary.v2.uploader.upload(imgs, {
    folder: 'image-streammer',
  })

  if (!imglUploadRes) return next(new ErrorHandler('Server not upload images'))

  temp.img = {
    public_id: imglUploadRes.public_id,
    url: imglUploadRes.url,
  }

  temp.thumbnails = []

  if (typeof thumbnails === 'string') {
    const thumbnailCloudRes = await cloudinary.v2.uploader.upload(thumbnails, {
      folder: 'thumbnail-streammer',
    })

    temp.thumbnails.push({
      public_id: thumbnailCloudRes.public_id,
      url: thumbnailCloudRes.url,
    })
  } else {
    for (let i = 0; i < thumbnails.lenght; i++) {
      const thumbnailCloudRes = await cloudinary.v2.uploader.upload(
        thumbnail[i],
        {
          folder: 'thumbnail-streammer',
        }
      )

      temp.thumbnails.push({
        public_id: thumbnailCloudRes.public_id,
        url: thumbnailCloudRes.url,
      })
    }
  }

  req.body.imgs = temp.img
  req.body.thumbnails = temp.thumbnails

  const registerStreammer = await new Streammer({
    ...req.body,
    idUser: user._id,
  })

  registerStreammer.page_id = registerStreammer.page_id
    ? registerStreammer.pape_id
    : registerStreammer.displayName

  await registerStreammer.save({validateBeforeSave: true})

  if (registerStreammer) {
    user.isStreammer = true
    await user.save()
  }

  res.status(200).json({
    success: true,
    message: 'user register streammer successfully',
    registerStreammer,
  })
})

const getCoins = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  return {
    coins: user.cost,
    message: 'get costs successfully',
    success: true,
  }
})

const getStreammer = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  if (!user) return next(new ErrorHandler('User not found', 404))

  if (user.isStreammer === false)
    return next(new ErrorHandler('Bạn chưa đăng kí streammer'))

  const streammer = await streammerModel.findOne({idUser: req.user.id})

  if (!streammer) return next()

  res.status(200).json({
    streammer,
    success: true,
    message: 'get streammer sucessfully',
  })
})

const updateProfileStreammer = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  if (!user) return next(new ErrorHandler('User not found', 404))

  if (user.isStreammer === false)
    return next(new ErrorHandler('Bạn chưa đăng kí streammer'))

  const streammer = await streammerModel.findOne({idUser: req.user.id})

  const newStreammerData = {}
  newStreammerData.thumbnails = []

  if (req.body.imgs !== undefined) {
    const imageId = streammer.imgs.public_id

    if (imageId) await cloudinary.v2.uploader.destroy(imageId)
    const myCloud = await cloudinary.v2.uploader.upload(req.body.imgs, {
      folder: 'thumbnail-streammer',
    })

    newStreammerData.imgs = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    }
  }

  if (typeof req.body.thumbnails === 'string') {
    for (let i = 0; i < streammer.thumbnails.length; i++) {
      await cloudinary.v2.uploader.destroy(streammer.thumbnails[i].public_id)
    }

    const thumbnails = await cloudinary.v2.uploader.upload(
      req.body.thumbnails,
      {
        folder: 'thumbnail-streammer',
      }
    )

    newStreammerData.thumbnails.push({
      public_id: thumbnails.public_id,
      url: thumbnails.url,
    })
  } else if (
    Array.isArray(req.body.thumbnails) &&
    req.body.thumbnails.lenght > 0
  ) {
    for (let i = 0; i < streammer.thumbnails.length; i++) {
      await cloudinary.v2.uploader.destroy(streammer.thumbnails[i].public_id)
    }

    for (let i = 0; i < streammer.thumbnails.length; i++) {
      const thumbnails = await cloudinary.v2.uploader.upload(
        req.body.thumbnails,
        {
          folder: 'thumbnail-streammer',
        }
      )

      newStreammerData.thumbnails.push({
        public_id: thumbnails.public_id,
        url: thumbnails.url,
      })
    }
  }

  req.body.imgs = newStreammerData.imgs
  if (newStreammerData.thumbnails.length) {
    req.body.thumbnails = newStreammerData.thumbnails
  } else {
    req.body.thumbnails = undefined
  }

  const updateStreammer = await Streammer.findOneAndUpdate(
    {
      idUser: user.id,
    },
    {
      ...req.body,
      thumbnail: newStreammerData.thumbnails,
      imgs: newStreammerData.imgs,
    },
    {
      new: true,
      runValidators: true,
    }
  )

  await updateStreammer.save()

  res.status(200).json({
    updateStreammer,
    success: true,
    message: 'updateStreammer successfully',
  })
})

module.exports = {
  login,
  logout,
  updatePassword,
  updateProfile,
  updatedUserRole,
  register,
  deleteUser,
  getSigleUser,
  getUserDetails,
  resetPassword,
  forgotPassword,
  getAllUser,
  registerStreammer,
  getCoins,
  getStreammer,
  updateProfileStreammer,
}
