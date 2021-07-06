
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const preferenceSachema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        preferences: [String],
    },
    {
        timestamps: true
    }
)


exports.Preference = mongoose.model('Preference', preferenceSachema);