const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your login!']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    lastLoginAt : {
      type: Date,
      default: Date.now()
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
    artworks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Artwork',
      },
    ],
    ratings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Rating'
      }
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Like',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    preference: 
      {
        type: Schema.Types.ObjectId,
        ref: 'Preference'
      },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

exports.User = mongoose.model('User', userSchema)


