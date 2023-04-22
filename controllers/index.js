const userController = require('./user.controller.js')
const categoryStreamerController = require('./categoryStream.controller.js')
const categoryPostController = require('./categoryPost.controller.js')
const reportTypeController = require('./reportType.controller.js')
const streamerController = require('./streammer.controller.js')
const commonController = require('./commom.controller.js')
const adminController = require('./admin.controller.js')
const reportPostCategoryController = require('./reportPostCategory.controller.js')
const reportPostController = require('./reportPost.controller')

module.exports = {
  userController,
  categoryStreamerController,
  categoryPostController,
  reportTypeController,
  streamerController,
  commonController,
  adminController,
  reportPostCategoryController,
  reportPostController
}
