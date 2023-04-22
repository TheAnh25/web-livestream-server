const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jsonWebToken = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      minLength: [4, 'Username must be at least 4 characters'],
      maxLength: [100, 'Username must be at most 255 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: [
        validator.isEmail,
        'Email is not valid please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    role: {
      type: String,
      default: 'user',
    },
    cost: {
      type: Number,
      default: 0,
    },
    profileDescription: {
      type: String,
    },
    isStreammer: {
      type: Boolean,
      default: false,
    },
    listBan: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
        name: {
          type: String,
        },
      },
    ],
    count_login: {
      type: Number,
      default: 0,
    },
    last_login: {
      type: Date,
      default: Date.now(),
    },
    gender: {
      type: Boolean,
      default: true,
    },
    show_gender: {
      type: Boolean,
      default: false,
    },
    show_phone: {
      type: Boolean,
      default: false,
    },
    show_email: {
      type: Boolean,
      default: false,
    },
    show_birthday: {
      type: Boolean,
      default: false,
    },
    birthday: {
      type: Date,
    },
    page_id: {
      type: String,
    },
    about: {
      type: String,
    },
    total_follower: {
      type: Number,
      default: 0,
    },
    total_following: {
      type: Number,
      default: 0,
    },
    total_notifications: {
      type: Number,
      default: 0,
    },
    total_post: {
      type: Number,
      default: 0,
    },
    cost_subscription: {
      type: Number,
      default: 0,
    },
    show_profile_index: {
      type: Boolean,
      default: true,
    },
    show_address: {
      type: Boolean,
      default: true,
    },
    listFollowStreamer: [
      {
        idStreamer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'streammer',
        },
        name: {
          type: String,
        },
        avatar: {
          public_id: String,
          url: String
        },
        description: {
          type: String
        }
      },
    ]
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJWTToken = function () {
  return jsonWebToken.sign({id: this._id}, process.env.SECRET_KEY_TOKEN, {
    expiresIn: process.env.EXPRIRES_IN_SECONDS,
  })
}

userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString('hex')
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000

  return resetToken
}

userSchema.methods.comparePassword = async function (passwordInput) {
  return await bcrypt.compare(passwordInput, this.password)
}

module.exports = mongoose.model('User', userSchema)
