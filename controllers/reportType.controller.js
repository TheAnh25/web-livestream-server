const {ReportType} = require('../models')

const catchAsyncError = require('../middleware/catchAsyncError.js')
const ErrorHandler = require('../middleware/errorHandler.js')

const reportTypeController = {}

reportTypeController.create = catchAsyncError(async (req, res, next) => {
  const newReportType = await ReportType.create({
    userId: req.user.id,
    ...req.body,
  })

  res.status(200).json({
    newReportType,
    success: true,
    message: 'Report created successfully',
  })
})

reportTypeController.getAllReportTypes = catchAsyncError(
  async (_, res, _next) => {
    const reportTypes = await ReportType.find({}).lean()

    const reportTypesCount = await ReportType.count()

    res.status(200).json({
      success: true,
      message: 'get all report tytpes successfully',
      reportTypesCount,
      reportTypes,
    })
  }
)

reportTypeController.getReportTypeById = catchAsyncError(
  async (req, res, next) => {
    const reportType = await ReportType.findById(req.params.id).lean()

    if (!reportType) next(new ErrorHandler('reportType not found', 404))

    res.status(200).json({
      success: true,
      message: 'get report type successfully',
      reportType,
    })
  }
)

reportTypeController.update = catchAsyncError(async (req, res, next) => {
  const reportType = await ReportType.findById(req.params.id)

  if (!reportType) next(new ErrorHandler('report type not found'))

  const updateReportType = await ReportType.findByIdAndUpdate({
    ...req.body,
  }).lean()

  await updateReportType.save()

  res.status(200).json({
    success: true,
    message: 'Updated report type successfully',
    updateReportType,
  })
})

module.exports = reportTypeController
