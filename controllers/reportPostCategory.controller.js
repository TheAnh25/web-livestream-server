const catchAsyncErrors = require('../middleware/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const reportPostCategoryController = {}
const {ReportPostCategory} = require('../models')

reportPostCategoryController.getAll = catchAsyncErrors(async (req, res, next) => {
  const reportPostCategories = await ReportPostCategory.find({}).lean()
  res.status(200).json({
    message: 'get report Post Categories',
    reportPostCategories,
    success: true
  })
})

reportPostCategoryController.getById = catchAsyncErrors(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorHandler('Params not id', 400))
  const reportPost = await ReportPostCategory.findById(req.params.id)
  if (!reportPost) return next(new ErrorHandler('report post not found', 404))
  res.status(200).json({
    message: 'get report post by id',
    success: true,
    reportPost
  })
})

reportPostCategoryController.create = catchAsyncErrors(async (req, res, next) => {
  const reportPostCategory = await ReportPostCategory.create({
    ...req.body,
    idAuthor: req.user.id
  })

  if (!reportPostCategory) return next(new ErrorHandler('Create error', 400))

  res.status(201).json({
    message: 'create report post category',
    reportPostCategory,
    success: true
  })
})

reportPostCategoryController.delete = catchAsyncErrors(async (req, res, next) => {
  if (!req.params.id) return next(new ErrorHandler('Params not id', 400))
  const deleteReportTypeCategory = await ReportPostCategory.findById(req.params.id)
  await deleteReportTypeCategory.remove()
  res.status(200).json({
    message: 'Delete successfully',
    success: true
  })
})

module.exports = reportPostCategoryController