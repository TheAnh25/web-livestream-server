const moment = require('moment')

const {
  Streammer,
  Post,
  CategoryPost,
  CategoryStream,
  Stream,
  User,
  ReportStream,
  ReportVideoStream,
} = require('../models')
const catchAsyncError = require('../middleware/catchAsyncError.js')

const commomController = {}

commomController.getCurrentDateTime = catchAsyncError(
  async (_req, res, _next) => {
    const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    return res.status(200).json({
      message: 'get current datetime successfully',
      success: true,
      currentDateTime,
    })
  }
)

commomController.getCurrentDate = catchAsyncError(async (_, res, _next) => {
  const currentDate = moment().format('YYYY-MM-DD')
  return res.status(200).json({
    messsage: 'get current date successfully',
    sucees: true,
    currentDate,
  })
})

commomController.getDataIndex = catchAsyncError(async (req, res, next) => {
  const userListRandom = await User.aggregate([
    {$sample: {size: 20}},
    {$match: {role: 'user', show_profile_index: true}},
  ])

  if (userListRandom) {
    userListRandom.forEach((item) => {
      delete item.password
      return item
    })
  }

  const posts = await Post.aggregate([
    {$sample: {size: 20}},
    {$match: {isPublish: true}},
  ])

  const streammers = await Streammer.find({}).limit(20).skip(1).lean()
  const categoriesPost = await CategoryPost.find({}).limit(20).skip(1).lean()
  const categoriesStream = await CategoryStream.find({})
    .limit(20)
    .skip(1)
    .lean()
  const reportsStream = await ReportStream.find({}).lean()
  const reportsVideoStream = await ReportVideoStream.find({}).lean()
  const lives = await Stream.find({}).limit(20).skip(1).lean()

  const streammersCount = await Streammer.count()
  const categoriesPostCount = await CategoryPost.count().lean()
  const usersCount = await User.count().lean()
  const postsCount = await Post.count().lean()
  const livesCount = await Stream.count().lean()
  const categoriesStreamCount = await CategoryStream.count().lean()

  res.status(200).json({
    userListRandom,
    success: 200,
    posts,
    streammers,
    categoriesPost,
    categoriesStream,
    reportsStream,
    reportsVideoStream,
    lives,
    streammersCount,
    categoriesPostCount,
    usersCount,
    postsCount,
    livesCount,
    categoriesStreamCount,
  })
})

module.exports = commomController
