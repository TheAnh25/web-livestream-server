const mongoose = require('mongoose')
const Schema = mongoose.Schema

const streamerSchema = new Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      unique: [true, 'duplicate displayName'],
    },
    discription: {
      type: String,
      required: true,
      minLenght: [50, 'description is require > 50'],
    },
    imgs: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    thumbnails: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    ratings: {
      type: [Number],
    },
    totalDonet: {
      type: Number,
      default: 0,
    },
    listDonet: [
      {
        idUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        idDonet: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'donet',
        },
        name: {
          type: String,
        },
      },
    ],
    listSubscribe: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        username: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    listCategoryStrem: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'categoryStream',
        },
      },
    ],
    listFollowers: [
      {
        idUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
      },
    ],
    listFollowings: [
      {
        idUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
      },
    ],
    gender: {
      type: Boolean,
      default: true,
    },
    page_id: {
      type: String,
    },
    levelChannal: {
      type: Number,
      default: 1,
    },
  },
  {timestamps: true}
)

module.exports = mongoose.model('streammer', streamerSchema)

streamerSchema.pre('save', async function (next) {
  console.log('save streammemr schema')
  if (!this.page_id) {
    this.page_id = this.displayName
  }
  next()
})
