const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const artworkSchema = new Schema(
  {
    name: String,
    discription: String,
    fandom: String,
    tags: [
      {
        type: String
      }
      
    ],
    chapters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Chapter',
      }
    ],
    ratings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Rating'
      }
    ],
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    isPublic:{
      type: Boolean,
      default: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    timestamps: true
  }
);

artworkSchema.index({ '$**': 'text' });
artworkSchema.index({  ratingsAverage: 1 });

  
  exports.Artwork = mongoose.model('Artwork', artworkSchema)

