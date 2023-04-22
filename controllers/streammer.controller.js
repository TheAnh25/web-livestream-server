const cloudinary = require('cloudinary')

const { Streammer, User } = require('../models')

const catchAsyncError = require('../middleware/catchAsyncError.js')
const ErrorHandler = require('../middleware/errorHandler.js')
const { is } = require('date-fns/locale')

const streammerController = {}

streammerController.create = catchAsyncError(async (req, res, next) => {
  const { imgs, thumbnail } = req.body

  const imgLinks = []

  if (!imgs || !thumbnail)
    next(new ErrorHandler('imgs and thumbnail are required', 400))

  const imgsUploadRes = await cloudinary.v2.uploader.upload(thumbnail, {
    folder: 'thumbnail-streammer',
  })

  let upload

  for (let i = 0; i < thumbnail.lenght; i++) {
    upload = await cloudinary.v2.uploader.upload(thumbnail[i], {
      folder: 'images-link',
    })

    imgLinks.push({
      public_id: upload.public_id,
      url: upload.url,
    })
  }

  const newStreammer = new Streammer.create({
    idUser: req.user.id,
    thumbnail: {
      public_id: imgsUploadRes.public_id,
      url: imgsUploadRes.url,
    },
    imgs: imgLinks,
    ...req.body,
  })

  res.status(200).json({
    newStreammer,
    message: 'create streammer successfully',
    success: true,
  })
})

streammerController.getDetailsById = catchAsyncError(async (req, res, next) => {
  const streammer = await Streammer.findById(req.params.id).lean()

  if (!streammer) next(new ErrorHandler('streammer is not found', 404))

  res.status(200).json({
    success: true,
    message: 'get streammer successfully',
    streammer,
  })
})

streammerController.getAllStreammer = catchAsyncError(
  async (req, res, next) => {
    const streammers = await Streammer.find({}).lean()
    const countStreammer = await Streammer.count()

    res.status(200).json({
      streammers,
      countStreammer,
      success: true,
      message: 'get all streammer successfully',
    })
  }
)

streammerController.addOrUnFollower = catchAsyncError(
  async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (!user) return next(new ErrorHandler('Bad request', 400))
    if (!req.body.streamerId) return next(new ErrorHandler('Bad request', 400))
    const isFollower = user.listFollowStreamer.findIndex(
      (follower) => follower.idStreamer.toString() === req.body.streamerId
    )
    const streamer = await Streammer.findById(req.body.streamerId)
    if (!streamer) return next(new ErrorHandler('streamer not found', 404))
    if (isFollower !== -1) {
      user.listFollowStreamer = [
        ...user.listFollowStreamer.filter(
          (item) => item.idStreamer.toString() !== streamer._id.toString()
        ),
      ]
      streamer.listFollowers = [
        ...streamer.listFollowers.filter(
          (item) => item.idUser.toString() !== user.id
        ),
      ]

      await user.save()
      await streamer.save()
      return res.status(200).json({
        message: 'Unfollowing successfully',
        success: true,
      })
    }

    user.listFollowStreamer.push({
      idStreamer: streamer._id,
      name: streamer.displayName,
      description: streamer.discription,
      avatar: {
        public_id: streamer.imgs.public_id,
        url: streamer.imgs.url,
      },
    })
    await user.save()

    streamer.listFollowers.push({
      idUser: user._id,
    })

    await streamer.save()

    res.status(200).json({
      message: 'Following successfully',
      success: true,
    })
  }
)

module.exports = streammerController
