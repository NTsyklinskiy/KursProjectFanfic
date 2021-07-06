const { gql } = require("apollo-server-core");

exports.UserSchema = gql`
type User {
      id: ID!
      name: String
      email: String
      password: String
      passwordConfirm: String
      role: String
      isOnline: Boolean
      lastLoginAt: String
      createdAt: String
      active: Boolean
      likes: [Like]
      comments: [Comment]
      artworks:[Artwork]
      preference: Preference
    }




    type UserPayload {
      id: ID!
      name: String
      email: String
      password: String
      passwordConfirm: String
      role: String
      isOnline: Boolean
      lastLoginAt: String
      createdAt: String
      active: Boolean
      likes: [LikePayload]
      ratings: [RatingPayload]
      comments: [CommentPayload]
      artworks:[ArtworkPayload]
      preferences: Preference
    }

    type LogOutData {
        boolean: Boolean!
    }

    type BatchPayload {
        count: Int!
    }

    input UserInputData {
        email: String!
        name: String
        password: String!
    }
    
    type AuthData {
        token: String!
    }

    type IsUserOnlinePayload {
        userId: ID!
        isOnline: Boolean
    }

`;