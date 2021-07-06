const { withFilter } = require("graphql-subscriptions");
const { pubSub } = require("../subscription");

exports.rating = {
    Query: {

    },
    Mutation: {
        createRating: async(parent, {input: {rating, artwork, user}}, {Rating, Artwork, User}) => {
            let newRating = await new Rating({
                rating,
                user,
                artwork,
              }).save();

              await Artwork.findOneAndUpdate({ _id: artwork }, { $push: { ratings: newRating.id } });
              await User.findOneAndUpdate({ _id: user }, { $push: { ratings: newRating.id } });

              const newArtwork = await Artwork.findById(artwork).populate([
                    {path: 'author'},
                    {path: 'chapters'},
                    {
                        path: 'ratings',
                        populate: ['user', 'artwork']
                    }
                ])

                  pubSub.publish('CREATE_AND_DELETE_RATINGS', {
                    publishRatings: {
                        operation: 'CREATE_AND_DELETE_RATING',
                        artwork: newArtwork
                    } 
                  })

              newRating = await newRating.populate('user').populate('artwork').execPopulate();

              
              return newRating;
        },
        deleteRating: async(parent,{ratingId}, {Rating, User, Artwork}) => {
            const rating = await Rating.findByIdAndRemove(ratingId)
            await User.findOneAndUpdate({ _id: rating.user }, { $pull: { ratings: rating.id } });
            await Artwork.findOneAndUpdate({ _id: rating.artwork }, { $pull: { ratings: rating.id } });

            const artwork = await Artwork.findById(rating.artwork).populate([
                {path: 'author'},
                {path: 'chapters'},
                {
                    path: 'ratings',
                    populate: ['user', 'artwork']
                }
            ])

            pubSub.publish('CREATE_AND_DELETE_RATINGS', {
                publishRatings: {
                    operation: 'CREATE_AND_DELETE_RATING',
                    artwork: artwork
                } 
              })

            return rating;
        }    
    },
    Subscription: {
        publishRatings: {
            subscribe: withFilter(
                () => pubSub.asyncIterator('CREATE_AND_DELETE_RATINGS'),
                (payload, variables, context) => {
                    console.log('payload', payload.publishRatings);
                    return payload.publishRatings.artwork.id === variables.artworkId
                }
            )
        }
    }
}