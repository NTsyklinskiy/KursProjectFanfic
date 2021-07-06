const {  gql } = require('apollo-server-express');
const {UserSchema} = require('./User')
const {ArtworkSchema} = require('./Artwork');
const { ChapterSchema } = require('./Chapter');


 const schema = gql`
    # scalar Upload
 
    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }

    ${UserSchema}

    ${ArtworkSchema}

   
 

    type Rating {
        id: ID!
        rating: Int
        artwork: ID
        user: ID
        createdAt: String
    }

    input CreateRatingInput{
        rating: Int!
        artwork: ID!
        user: ID!
    }

    type RatingPayload{
        id: ID
        rating: Int
        user: UserPayload
        artwork: ArtworkPayload
        createdAt: String
    }

    ${ChapterSchema}

  


    type Comment {
        id: ID!
        comment: String!
        author: ID
        chapter: ID
        createdAt: String
    }

    input CreateCommentInput {
      comment: String!
      author: ID!
      chapterId: ID!
    }

    input DeleteCommentInput {
      id: ID!
    }
    
    type CommentPayload {
        id: ID
        comment: String
        author: UserPayload
        chapter: ChapterPayload
        createdAt: String
    }


    type Like {
        id: ID!
        chapter: ID
        user: ID
    }

    input CreateLikeInput {
        userId: ID!
        chapterId: ID!
    }

    type LikePayload {
        id: ID!
        chapter: ChapterPayload
        user: UserPayload
    }
    
    type Preference{
        id: ID!
    }


    type Tag {
        id: ID
        tags: [String]!
    }

    type PublishArtwork{
        operation: String
        artworks: [ArtworkPayload]
    }
    type RatingArtwork{
        operation: String
        artwork: ArtworkPayload
    }

    type Query {
        allUsers: [UserPayload]
        getAuthUser: UserPayload

        searchArtworks(searchQuery: String): [ArtworkPayload]
        getArtworks: [ArtworkPayload]
        getArtwork(id: ID!): ArtworkPayload
        getTags: Tag

        getChapter(id: ID!): ChapterPayload

        getComments(chapterId: ID!): [CommentPayload]
    }

  

    type Mutation {
        signin(email: String!, password: String!): AuthData!
        signup(userInput: UserInputData): AuthData!
        deleteUsers(usersIds: [ID!]!): BatchPayload!
        blockUsers(usersIds: [ID!]!): BatchPayload!
        unBlockUsers(usersIds: [ID!]!): BatchPayload!

        createArtwork(input: CreateArtworkInput!): ArtworkPayload
        deleteArtwork(input: DeleteArtworkInput!): ArtworkPayload
        artworkPublic(artworkId: ID!): ArtworkPayload
        
        createRating(input: CreateRatingInput!): RatingPayload
        deleteRating(ratingId: ID!): RatingPayload
        

        createChapter(input: CreateChapterInput!): ChapterPayload

        createComment(input: CreateCommentInput!): CommentPayload
        deleteComment(commentId: ID!): CommentPayload

        createLike(input: CreateLikeInput!): LikePayload
        deleteLike(likeId: ID!): LikePayload
    }

    type Subscription {
        isUserOnline(authUserId: ID!, userId: ID!): IsUserOnlinePayload
        publishArtworks: PublishArtwork

        publishRatings(artworkId: ID!): RatingArtwork

        commentCreated(chapterId: ID!): CommentPayload
  }
`;

module.exports = schema;