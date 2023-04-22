const dbModel = require('../models')

const catchAsyncError = require('../middleware/catchAsyncError')

const adminController = {}

adminController.dataIndex = catchAsyncError(async (req, res, next) => {
  const start = new Date().getTime();
  const users = await dbModel.User.find({}).limit(10).skip(1).lean()
  const usersCount = await dbModel.User.count()

  const categoriesPost = await dbModel.CategoryPost.find({})
    .limit(10)
    .skip(1)
    .lean()
  const categoriesPostCount = await dbModel.CategoryPost.count()

  const categoriesStream = await dbModel.CategoryStream.find({})
    .lean()
    .limit(10)
    .skip(1)
    .lean()
  const categoriesStreamCount = await dbModel.CategoryStream.count()

  const posts = await dbModel.Post.find({}).limit(10).skip(1).lean()
  const postCount = await dbModel.Post.count()

  const typesReportCount = await dbModel.ReportType.count()
  const reportsCount = await dbModel.ReportStream.count()

  const end = new Date().getTime();

// Now calculate and output the difference
  console.log(end - start);

  res.status(200).json({
    message: 'get data index success fully',
    success: true,
    users,
    usersCount,
    categoriesPost,
    categoriesPostCount,
    categoriesStream,
    categoriesStreamCount,
    posts,
    postCount,
    typesReportCount,
    reportsCount,
  })
})

adminController.manageUser = catchAsyncError(async (req, res, next) => {
})

adminController.test = catchAsyncError(async (req, res, next) => {
  res.status(200).json({message: 'test successfully'})
})

module.exports = adminController
