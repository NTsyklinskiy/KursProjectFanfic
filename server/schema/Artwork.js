const { gql } = require('apollo-server-express')

exports.ArtworkSchema = gql`

type Artwork {
        id: ID!
        name: String
        discription: String
        fandom: String
        tags: [String]
        author: User!
        chapters: [Chapter]
        ratings: [Rating]
        ratingsAverage: String
        ratingsQuantity: String
        createdAt: String
    }



    input CreateArtworkInput {
        name: String
        discription: String
        fandom: String
        tags: [String]!
        authorId: ID!
    }

    input DeleteArtworkInput {
        id: ID!
    }

    type UserArtworksPayload {
        artworks: [ArtworkPayload]!
    }

    type ArtworkPayload {
        id: ID!
        name: String
        discription: String
        fandom: String
        tags: [String]!
        author: UserPayload
        chapters: [ChapterPayload]
        ratings: [RatingPayload]
        ratingsAverage: String
        ratingsQuantity: String
        createdAt: String
        isPublic: Boolean
    }

    type ArtworksPayload {
        artworks: [ArtworkPayload]!
    }
 `;