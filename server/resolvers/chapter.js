const { GraphQLUpload } = require('graphql-upload');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');


const fs = require('fs');
const storeFS = ({stream, filename }) => {
  const uploadDir = './public';
  const path = `${uploadDir}/${filename}`;
  return new Promise((resolve, reject) =>
      stream
          .on('error', error => {
              if (stream.truncated)
                  fs.unlinkSync(path);
              reject(error);
          })
          .pipe(fs.createWriteStream(path))
          .on('error', error => reject(error))
          .on('finish', () => resolve({ path }))
  );
}


exports.chapter = {
    Upload: () => GraphQLUpload,
    Query: {
      getChapter: async(parent, {id}, {Chapter}) => {
        const chapter = await Chapter.findById(id)
                .populate([
                  {path: 'artwork'},
                  {
                    path: 'likes',
                    populate: ['user', 'chapter']
                  },
                  {
                    path: 'comments',
                    populate: 'author'
                  }
                  ])
            return chapter
      },
    },
    Mutation: {
        createChapter: async(parent, {input: {title, text, artworkId}, file}, {Chapter, Artwork}) => {
          if (!title && !text) {
            throw new Error('Chapter title and text is required.');
          }

          let imageUrl = '',
              imagePublicId = '';
                          
              
          if(!file){
            throw new Error('Chapter image is required.');
          }
          const {
            file: { filename, mimetype, encoding, createReadStream },
          } = file;
          const stream = createReadStream();
          // const image = await storeFS({stream, filename})
          const files = await uploadToCloudinary(stream,'chapter')
          if (!files.secure_url) {
            throw new Error('Something went wrong while uploading image to Cloudinary');
          }
          
          imageUrl = files.secure_url;
          imagePublicId = files.public_id;
          
          const newChapter = await new Chapter({
            title,
            text,
            image: imageUrl ,
            imagePublicId: imagePublicId,
            artwork: artworkId,
          }).save();
      
        await Artwork.findOneAndUpdate({ _id: artworkId }, { $push: { chapters: newChapter.id } });
        
        return newChapter;
      },
      updateChapter: async(paernt, {input: {chapterId,title, text, imagePublicId}}, {Chapter} ) => {
        console.log(chapterId,title, text, imagePublicId);
        if (!title || !text ) {
          throw new Error('Chapter title, text is required.');
        }
          
        const fieldsToUpdate = {title, text};
        const updatedChapter = await Chapter.findOneAndUpdate({ _id: chapterId }, { ...fieldsToUpdate }, { new: true })
          .populate('artwork')

        return updatedChapter;
      },
      deleteChapter:async (paernt, {input: {chapterId, imagePublicId}}, {Chapter, Comment, Like, User,Artwork})=> {
        console.log(chapterId, imagePublicId);
        if (imagePublicId) {
          const deleteImage = await deleteFromCloudinary(imagePublicId);
          console.log(deleteImage);
          if (deleteImage.result !== 'ok') {
            throw new Error('Something went wrong while deleting image from Cloudinary');
          }
        }

        const chapter = await Chapter.findByIdAndRemove(chapterId);
        await Artwork.findOneAndUpdate({ _id: chapter.artwork }, { $pull: { chapters: chapter.id } });
        await Like.find({ chapter: chapter.id }).deleteMany();
        chapter.likes.map(async (likeId) => {
          await User.where({ likes: likeId }).update({ $pull: { likes: likeId } });
        });

        await Comment.find({ chapter: chapter.id }).deleteMany();
        chapter.comments.map(async (commentId) => {
          await User.where({ comments: commentId }).update({
            $pull: { comments: commentId },
          });
        });


        return chapter
    
      }
    }
}

