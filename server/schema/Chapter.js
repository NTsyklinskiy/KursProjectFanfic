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
        artworkId: ID!   
    }
    input UpdateChapterInput {
        imagePublicId: String
        title: String
        text: String
        chapterId: ID!
    }
    input DeleteChapterInput {
        imagePublicId: String
        chapterId: ID!
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