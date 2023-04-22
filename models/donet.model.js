const mongoose = require('mongoose')
const Schema = mongoose.Schema

const donetSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    money: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('donet', donetSchema)
