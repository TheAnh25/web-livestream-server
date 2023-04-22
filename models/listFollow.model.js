const mongoose = require('mongoose')
const Schema = mongoose.Schema

const listFollowSchema = new Schema(
  {
    idStreammer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'streammer',
    },
    name: {
      type: String,
    },
    url: {
      type: String,
    },
    isNoti: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('listFollowSchema', listFollowSchema)
