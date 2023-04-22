const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reportVideoStream = new Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    idTypeReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'typeReport',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('reportVideoStream', reportVideoStream)
