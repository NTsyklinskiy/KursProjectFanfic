const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        comment: {
            type: String,
            required: true,
            text: true
        },
        chapter: {
            type: Schema.Types.ObjectId,
            ref: 'Chapter',
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    }, 
    {
        timestamps: true,
    }
)

exports.Comment = mongoose.model('Comment', commentSchema)