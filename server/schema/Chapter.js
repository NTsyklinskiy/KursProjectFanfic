const { gql } = require('apollo-server-express')


exports.ChapterSchema = gql`
 type Chapter {
        id: ID!
        title: String
        text: String
        image: File
        imagePublicId: String
        likes: [Like]
        comments: [Comment]
        createdAt: String
        updatedAt: String
    }

    input CreateChapterInput{
        title: String
        text: String
        image: Upload
        imagePublicId: String
        artworkId: ID!   
    }

    type ChapterPayload {
        id: ID!
        title: String
        text: String
        image: String
        imagePublicId: String
        artwork: ArtworkPayload
        likes: [LikePayload]
        comments: [CommentPayload]
        createdAt: String
        updatedAt: String
    }
`;