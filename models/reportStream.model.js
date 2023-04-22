const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reportStream = new Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isUser: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    idStreammer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'streammer',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('reportStream', reportStream)
