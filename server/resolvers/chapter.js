const { GraphQLUpload } = require('graphql-upload');
const cloudinary = require('cloudinary');
const shortid = require('shortid');
const fs = require('fs');

const storeUpload = async ({ stream, filename, imagePublicId }) => {
  const id = shortid.generate();
  const options = imagePublicId ? { public_id: imagePublicId, overwrite: true } : { public_id: `chapter/${id}-${filename}` };
    
  cloudinary.config({
    cloud_name: 'llallaha',
    api_key: '898933834934999',
    api_secret: 'kjm1Qcl7q796t5mNKAMjD2ZspIs',
  });

    return new Promise((resolve, reject) => {
        const streamLoad = cloudinary.v2.uploader.upload_stream({...options, timeout:120000}, (error, result) => {
          console.log(error, result);
        if (error) {
          reject(error);
        }
        resolve(result);
        });
    
        stream.pipe(streamLoad);
    });
};

const processUpload = async ({stream, filename, mimetype}) => {
  
  return new Promise((resolve, reject) => {
    const id = shortid.generate();
    const path = `images/${id}-${filename}`;
    stream
    .pipe(fs.createWriteStream(path))
    .on('finish', () => resolve({ id, path, filename, mimetype }))
    .on('error', reject)
  }).catch(err => {
    console.log(err);
  });
};


exports.chapter = {
    Query: {
      getChapter: async(parent, {id}, {File,Chapter, Artwork}) => {
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
        createChapter: async(parent, {input: {title, text, image, artworkId}}, {File,Chapter, Artwork}) => {
          if (!title && !text) {
            throw new Error('Chapter title and text is required.');
          }

          let imageUrl = '',
              imagePublicId = '';
                          
              
              if(image){
                console.log('this image',image);
                fs.mkdir('images', { recursive: true }, (err) => {
                  if (err) throw err;
                });
                
                const { createReadStream, filename, mimetype, encoding } = await image;
                const stream = createReadStream();
                const files = await processUpload({ stream, filename, mimetype })
                // const files = await storeUpload({ stream, filename });
                console.log(files);

          }
          
          const newChapter = await new Chapter({
            title,
            text,
            image: imageUrl ,
            imagePublicId: imagePublicId,
            artwork: artworkId,
          }).save();
      
        await Artwork.findOneAndUpdate({ _id: artworkId }, { $push: { chapters: newChapter.id } });
        
        return newChapter;
      }
    }
}