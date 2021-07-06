// const { ChapterSchema } = require('../schema/Chapter');
const {pubSub, EVENTS} = require('../subscription');

exports.artwork = {
    Query: {
        searchArtworks:async (parent, {searchQuery},{Artwork}) => {
            const search = await Artwork.find({ $text: { $search: searchQuery}, isPublic: {$ne: false}})
                .populate([
                    {path: 'author'},
                    {path: 'chapters'},
                    {
                        path: 'ratings',
                        populate: ['user', 'artwork']
                    }
                ])
            
            return search
        },
        getTags: async(parent, args, {Tag}) => {
            return await Tag.findById('60e2281a25e14747371e07b6')
        },
        getArtworks: async(parent, args, {Artwork}) => {
                 const artworks = await Artwork.find(
                    {
                        isPublic: { $ne: false}
                    }
                ) 
                .populate([
                    {path: 'author'},
                    {path: 'chapters'},
                    {
                        path: 'ratings',
                        populate: ['user', 'artwork']
                    }
                ])

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

                console.log(artwork);
            return artwork
        }
    },
    Mutation: {
        createArtwork: async(parent, {input: { name, discription, fandom, tags, authorId}}, {User, Artwork, Tag}) => {
            console.log( tags );
                if (!name || !discription || !fandom ) {
                  throw new Error('Artwork name, discription, fandom, tag is required.');
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
                await Tag.findOneAndUpdate({_id: '60e2281a25e14747371e07b6'}, { $push: { tags: tags}})
                return newArtwork;
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
      
    },
    Subscription:{
        publishArtworks: {
            subscribe:  async () => pubSub.asyncIterator('PUBLISH_ARTWORK'),
        },
    }
}