const {pubSub, EVENTS} = require('../subscription');
const { deleteFromCloudinary} = require('../utils/cloudinary');

exports.artwork = {
    Query: {
        getTags: async(parent, args, {Tag}) => {
            return await Tag.findById('60e6e820dfeeec3f977956f0')
        },
        getArtworks: async(parent, {preference=[], searchQuery = ''}, {authUser,Artwork}) => {
            console.log(preference, searchQuery);
            console.log(authUser?.role);
            if(authUser?.role === 'admin'){
                return await Artwork.find()
                .sort('-createdAt')
                .populate([
                    {path: 'author'},
                    {path: 'chapters'},
                    {
                        path: 'ratings',
                        populate: ['user', 'artwork']
                    }
                ])    
            }

            
            const artworks = await Artwork.find(
                {
                    isPublic: { $ne: false}
                }
                )
            .sort('-createdAt')
            .populate([
                {path: 'author'},
                {path: 'chapters'},
                {
                    path: 'ratings',
                    populate: ['user', 'artwork']
                }
            ])
            if(searchQuery){
                const search = await Artwork.find({$or: [
                    {name: new RegExp(searchQuery, 'i') },
                    {discription: new RegExp(searchQuery, 'i') },
                    {tags: new RegExp(searchQuery, 'i') },
                    {fandom: new RegExp(searchQuery, 'i') },
                ],
                isPublic: {$ne: false}})
                .populate([
                    {path: 'author'},
                    {path: 'chapters'},
                    {
                        path: 'ratings',
                        populate: ['user', 'artwork']
                    }
                ]);
                
                return search
            }

            if(preference.length){
                console.log('preference.length',preference.length);
                const artworksPreference = await Artwork.find(
                    {
                        isPublic: { $ne: false}
                    }
                    ).where({
                            fandom: preference,
                        })
                .sort('-createdAt')
                .populate([
                    {path: 'author'},
                    {path: 'chapters'},
                    {
                        path: 'ratings',
                        populate: ['user', 'artwork']
                    }
                ])
                
                const artworksRemaining = await Artwork.find(
                    {
                        fandom: {$nin: preference},
                        isPublic: { $ne: false}
                    }
                    )
                .sort('-createdAt')
                .populate([
                    {path: 'author'},
                    {path: 'chapters'},
                    {
                        path: 'ratings',
                        populate: ['user', 'artwork']
                    }
                ])

                return [...artworksPreference, ...artworksRemaining]
            }
                
                return artworks;

            },
        getArtwork: async(parent, {id}, {Artwork}) => {

            const artwork = await Artwork.findById(id)
                .populate([
                    {path: 'author'},
                    {path: 'chapters'},
                    {
                        path: 'ratings',
                        populate: ['user', 'artwork']
                    }
                ])

            return artwork
        }
    },
    Mutation: {
        createArtwork: async (parent, {input: { name, discription, fandom, tags, authorId}}, {User, Artwork, Tag}) => {
                if (!name || !discription || !fandom ) {
                  throw new Error('Artwork name, discription, fandom is required.');
                }
                if(!tags.length) {
                  throw new Error('Artwork tag is required.');
                }
                
                let newArtwork = await new Artwork({
                  name,
                  discription,
                  fandom,
                  tags,
                  author: authorId,
                }).save();
                
                newArtwork = await newArtwork.populate('author').execPopulate();
           
                await User.findOneAndUpdate({ _id: authorId }, { $push: { artworks: newArtwork.id } });
                await Tag.findOneAndUpdate({_id: '60e6e820dfeeec3f977956f0'}, { $push: { tags: tags}})
                return newArtwork;
        },
        updateArtwork: async (parent, {input: { name, discription, fandom, tags, artworkId}}, {Artwork, Tag}) => {
            if (!name || !discription || !fandom ) {
                throw new Error('Artwork name, discription, fandom is required.');
            }
            if(!tags.length) {
                throw new Error('Artwork tag is required.');
            }

            const fieldsToUpdate = {name, discription, fandom, tags};
            await Tag.findOneAndUpdate({_id: '60e6e820dfeeec3f977956f0'}, { $push: { tags: tags}});
            const updatedArtwork = await Artwork.findOneAndUpdate({ _id: artworkId }, { ...fieldsToUpdate }, { new: true })
            .populate('author')
            .populate('chapters')
            console.log(updatedArtwork);
            return updatedArtwork;
        },
        artworkPublic: async (parent, {artworkId}, {Artwork}) => {
            const artwork = await Artwork.findById(artworkId)
            .populate([
                {path: 'author'},
                {path: 'chapters'}
            ])         
            await artwork.isPublic ? await artwork.updateOne({ isPublic: false }) : await artwork.updateOne({ isPublic: true })
            
            pubSub.publish('PUBLISH_ARTWORK', {

                publishArtworks:{ 
                    operation: 'PUBLISH_AND_NO_ARTWORK',
                    artworks: [artwork]
                } 
            })
            return artwork
        },
        deleteArtwork: async (parent,{artworkId}, {Artwork, Chapter, User,Comment, Like, Rating}) =>{
            const artwork = await Artwork.findByIdAndRemove(artworkId);
            await User.findOneAndUpdate({ _id: artwork.author }, { $pull: { artworks: artwork.id } });

            artwork?.chapters.forEach(async (chapterId) => {
                const chapter = await Chapter.findByIdAndRemove(chapterId);
                console.log(chapter);
                await Like.find({ chapter: chapterId }).deleteMany();
                chapter?.likes.map(async (likeId) => {
                  await User.where({ likes: likeId }).update({ $pull: { likes: likeId } });
                });
                await Comment.find({ chapter: chapterId }).deleteMany();
                chapter?.comments.map(async (commentId) => {
                  await User.where({ comments: commentId }).update({
                    $pull: { comments: commentId },
                  });
                });
                if(chapter?.imagePublicId){
                    await deleteFromCloudinary(chapter?.imagePublicId);
                }
            })
            await Rating.find({ artwork: artwork.id }).deleteMany();

            artwork.ratings.map(async (ratingId) => {
            await User.where({ ratings: ratingId }).update({ $pull: { ratings: ratingId } });
            });
          
        
            return artwork
        },
    },
    Subscription:{
        publishArtworks: {
            subscribe:  async () => pubSub.asyncIterator('PUBLISH_ARTWORK'),
        },
    }
}