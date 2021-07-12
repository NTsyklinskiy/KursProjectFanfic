const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const chapterSchema = new Schema(
  {
    title: {
      type:String,
      text: true
    },
    text: {
      type:String,
      text: true
    },
    artwork: {
      type: Schema.Types.ObjectId,
      ref: 'Artwork',
      text: true
    },
    likes: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Like',
          
        },
      ],
    image: String,
    imagePublicId: String,
    coverImage: String,
    coverImagePublicId: String,
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },{
    timestamps: true,
  })

// chapterSchema.index({ title: 'text',text: 'text', comments: 'text' });

exports.Chapter = mongoose.model('Chapter', chapterSchema);

