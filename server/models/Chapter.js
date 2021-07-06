const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const chapterSchema = new Schema(
  {
    title: String,
    text: String,
    artwork: {
      type: Schema.Types.ObjectId,
      ref: 'Artwork'
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

chapterSchema.index({ title: 'text',text: 'text', comments: 'text' });

exports.Chapter = mongoose.model('Chapter', chapterSchema);

