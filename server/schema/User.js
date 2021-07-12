const { gql } = require("apollo-server-core");

exports.UserSchema = gql`
type User {
      id: ID!
      name: String
      email: String
      password: String
      role: String
      isOnline: Boolean
      lastLoginAt: String
      createdAt: String
      active: Boolean
      likes: [Like]
      comments: [Comment]
      artworks:[Artwork]
      preference: [String]
      isFirstLogin: Boolean
      isMailConfirm: Boolean
    }

    type UserPayload {
      id: ID!
      name: String
      email: String
      password: String
      role: String
      isOnline: Boolean
      lastLoginAt: String
      createdAt: String
      active: Boolean
      likes: [LikePayload]
      ratings: [RatingPayload]
      comments: [CommentPayload]
      artworks:[ArtworkPayload]
      preference: [String]
      isMailConfirm: Boolean
      isFirstLogin: Boolean
    }


    type BatchPayload {
        count: Int!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }
    
    type AuthData {
        token: String!
    }

    type AuthMessageConfirm{
        message: String!
    }

    type IsUserOnlinePayload {
        userId: ID!
        isOnline: Boolean
    }

`;