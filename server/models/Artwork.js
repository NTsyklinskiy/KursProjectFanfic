const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const artworkSchema = new Schema(
  {
    name: {
      type:String,
      text: true
    },
    discription:{
      type:String,
      text: true
    },
    fandom:{
      type:String,
      text: true
    },
    tags: [
      {
        type:String,
        text: true
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

// artworkSchema.index({ $name: 'text', $discription: 'text', $fandom: 'text', $tags: 'text' });
artworkSchema.index({  ratingsAverage: 1 });

  
  exports.Artwork = mongoose.model('Artwork', artworkSchema)

