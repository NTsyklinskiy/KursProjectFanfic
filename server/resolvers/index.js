const {user} = require('./user');
const {artwork} = require('./artwork');
const { chapter } = require('./chapter');
const { comment } = require('./comment');
const { like } = require('./like');
const { rating } = require('./rating');

module.exports = [
    user, artwork, chapter, comment, like, rating
]