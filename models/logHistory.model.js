const mongoose = require('mongoose')
const Schema = mongoose.Schema

const logHistorySchema = new Schema(
  {
    users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    isNotLoggin: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('logHistory', logHistorySchema)
