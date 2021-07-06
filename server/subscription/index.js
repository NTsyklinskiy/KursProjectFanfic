const {PubSub} = require('apollo-server-express')
const COMMENT_EVENTS = require('./comment')
const USER_EVENTS = require('./user')
const ARTWORK_EVENTS = require('./artwork')
exports.EVENTS = {
    COMMENT: COMMENT_EVENTS,
    USER: USER_EVENTS,
    ARTWORK: ARTWORK_EVENTS
}

exports.pubSub  = new PubSub();