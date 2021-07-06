const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema(
    {
        chapter: {
          type: Schema.Types.ObjectId,
          ref: 'Chapter'
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
    },
    {
        timestamps: true,
    }
)

exports.Like = mongoose.model('Like', likeSchema)