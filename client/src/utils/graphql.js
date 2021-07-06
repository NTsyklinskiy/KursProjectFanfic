import { gql } from '@apollo/client';

export const SEARCH_ARTWORKS = gql`
query SEARCH_ARTWORKS($searchQuery: String!){
  searchArtworks(searchQuery: $searchQuery){
    id
    name
    discription
    fandom
    author{
      id
      name
    }
    ratings{
      id
      rating
      user{
        id
      }
      artwork{
        id
      }
 
    }
    ratingsAverage
    ratingsQuantity
    chapters{
      id
      title
    }
  }
}
`;

export const GET_ARTWORK = gql`
query GET_ARTWORK($id: ID!){
  getArtwork(id: $id){
    id
    name
    chapters{
      id
    }
    ratings{
      id
      rating
    }
    discription
    fandom
    author{
      id
      name
    }
    chapters{
      id 
      title
    }
    isPublic
  }
}
`;



export const GET_ALL_ARTWORKS = gql`
query GET_ALL_ARTWORKS{
  getArtworks{
    id
    name
    discription
    fandom
    author{
      id
      name
    }
    ratings{
      id
      rating
      user{
        id
      }
      artwork{
        id
      }
 
    }
    ratingsAverage
    ratingsQuantity
    chapters{
      id
      title
    }
  }
}
`;

export const ARTWORK_PUBLISH = gql`
mutation ARTWORK_PUBLISH($artworkId: ID!){
  artworkPublic(artworkId: $artworkId){
    id
  }
}`;

export const GET_PUBLISH_ARTWORK = gql`
subscription GET_PUBLISH_ARTWORK{
  publishArtworks{
    operation
    artworks{
      id
      name
      discription
      fandom
      author{
        id
        name
      }
      ratingsAverage
      ratingsQuantity
      chapters{
        id
        title
      }
    }
  }
}
`;

export const CREATE_ARTWORK = gql`
mutation CREATE_ARTWORK($input: CreateArtworkInput!) {
  createArtwork(input: $input) {
    id
    name
  }
}
`;

export const GET_TAGS= gql`
query GET_TAGS{
  getTags{
    id
    tags
  }
}
`;

export const CREATE_RATING = gql`
mutation($input:CreateRatingInput!){
  createRating(input:$input){
    id
    rating
    user{
      id
    }
    artwork{
      id
      name
    }
    createdAt
  }
}
`;

export const DELETE_RATING = gql`
mutation DELETE_RATING($ratingId: ID!){
  deleteRating(ratingId:$ratingId){
    id
  }
}`;

export const CREATE_DELETE_RATING = gql`
subscription CREATE_DELETE_RATING($artworkId: ID!){
  publishRatings(artworkId: $artworkId){
    operation
    artwork {
      id
    name
    discription
    fandom
    author{
      id
      name
    }
    ratings{
      id
      rating
      user{
        id
      }
      artwork{
        id
      }
 
    }
    ratingsAverage
    ratingsQuantity
    chapters{
      id
      title
    }
      }
  }
}
`;

export const CREATE_CHAPTER = gql`
mutation CREATE_CHAPTER($input: CreateChapterInput!){
  createChapter(input: $input){
    id
    title
  }
}
`;

export const GET_CHAPTER = gql`
query GET_CHAPTER($id: ID!){
  getChapter(id: $id){
    id
    title
    text
    artwork{
      id
    }
    likes{
      id
      user{
        id
      }
      chapter{
        id
      }
    }
    comments{
      id
      comment
      createdAt
      author{
        id
        name
        email
      }
    }
 
  }
}
`;

export const GET_COMMENTS = gql`
query($chapterId: ID!){
  getComments(chapterId: $chapterId){
    id
    comment
    author{
      id
      name
      email
    }
    chapter{
      id
    }
    createdAt
  }
}`;

export const CREATE_COMMENT=gql`
mutation CREATE_COMMENT($input: CreateCommentInput!){
  createComment(input:$input){
    id
    author{
      id
      name
      email
    }
    chapter{
      id
    }
    comment
    createdAt
  }
}`;

export const DELETE_COMMENT = gql`
mutation DELETE_COMMENT($commentId: ID!){
  deleteComment(commentId: $commentId){
    id
    comment
    # author{
    #   id
    # }
    # chapter{
    #   id
    # }
  }
}`;

export const COMMENTS_CREATED = gql`
subscription($chapterId: ID!){
  commentCreated(chapterId: $chapterId){
    id
    author{
      id
      name
      email
    }
    chapter{
      id
    }
    comment
    createdAt
  }
}
`

export const CREATE_LIKE = gql`
mutation CREATE_LIKE($input: CreateLikeInput!){
  createLike(input: $input) {
    id
    chapter{
      id
    }
    user{
      id
    }
  }
}
`; 
export const DELETE_LIKE = gql`
mutation DELETE_LIKE($likeId: ID!){
  deleteLike(likeId: $likeId){
    id
  }
}
`;


export const GET_ALL_USERS = gql`
query { 
  allUsers {
    id
    name
    email
    password
    isOnline
    lastLoginAt
    createdAt
    active
  }
}
`;

export const GET_AUTH_USER = gql`
  query {
    getAuthUser {
      id
      name
      email
      createdAt
      lastLoginAt
      isOnline
      role
      artworks{
        id
        name
        discription
        fandom
        chapters{
          id
          title
        }
      }
      likes{
        id
      }
      comments{
        id
      }
      preferences{
        id
      }
    }
  }
`;

export const SIGN_IN = gql`
    mutation SIGNIN($email: String!,$password: String! ){
      signin(email:$email, password: $password){
        token
      }
    }
`;

export const SIGN_UP = gql`
    mutation SIGNUP($userInput: UserInputData ){
      signup(userInput: $userInput){
        token
      }
    }
`;

export const LOG_OUT = gql`
  mutation LOG_OUT($userId: String!){
    logout(userId: $userId){
      boolean
    }
  }
`;

export const DELETE_USERS = gql`
  mutation DELETE_USERS($usersIds: [ID!]!){
    deleteUsers(usersIds: $usersIds){
      count
    }
  }
`;

export const BLOCK_USERS = gql`
  mutation BLOCK_USERS($usersIds: [ID!]!){
    blockUsers(usersIds: $usersIds){
      count
    }
  }
`;

export const UNBLOCK_USERS = gql`
  mutation UNBLOCK_USERS($usersIds: [ID!]!) {
    unBlockUsers(usersIds: $usersIds){
      count
    }
  }
  `;
