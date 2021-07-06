const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const {Artwork} = require('./Artwork')

const ratingSchema = new Schema(
    {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      artwork: {
        type: Schema.Types.ObjectId,
        ref: 'Artwork'
      }, 
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }, {
      timestemps: true
    }
);
  
ratingSchema.index({ 'artwork': 1, 'user': 1 }, { unique: true, dropDups: true });

ratingSchema.statics.calcAverageRatings = async function(artworkId) {
  const stats = await this.aggregate([
    {
      $match: { artwork: artworkId },
    },
    {
      $group: { 
        _id: '$artwork',
        nRating: { $sum:1 },
        avgRating: {$avg: '$rating'}
      }
    },
  ]);
  if(stats.length > 0) {
    await Artwork.findByIdAndUpdate(artworkId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    })
  } else {
    await Artwork.findByIdAndUpdate(artworkId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    })
  }
};

ratingSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.artwork);
});

ratingSchema.pre(/^findOneAnd/, async function(next){
  this.r = await this.findOne();
  next()
});

ratingSchema.post(/^findOneAnd/, async function(){
  await this.r.constructor.calcAverageRatings(this.r.artwork)
});

exports.Rating = mongoose.model('Rating', ratingSchema);