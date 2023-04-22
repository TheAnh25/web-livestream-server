const mongoose = require('mongoose')
const Schema = mongoose.Schema

const streamSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    room_id: {
      type: String,
      required: true,
    },
    cateStreamId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'categoryStream',
      },
    ],
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    url: {
      type: String,
    },
    status: {
      type: Boolean,
      required: true,
    },
    avatarStreamer: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      }
    }
  },
  {timestamps: true}
)

module.exports = mongoose.model('Stream', streamSchema)

