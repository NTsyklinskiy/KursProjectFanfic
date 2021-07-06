const bcrypt = require('bcryptjs')
const { withFilter } = require('apollo-server');

const {pubSub, EVENTS} = require('../subscription');
const generateToken = require('../utils/generateToken');


exports.user = {
  Query: {
    allUsers: async (parent, args, {authUser, User}, info) => {
       const artworks = await User.find().populate([
          {path: 'artworks'},
          {
           path: 'ratings',
           populate: ['user', 'artwork']
          }
        ]);
       return artworks
    },
    getAuthUser: async (root, args, { authUser, User }) => {
      if (!authUser) return null;
      const user = await User.findOneAndUpdate({ email: authUser.email }, { isOnline: true, lastLoginAt:Date.now() })
      .populate([
        {
          path: 'artworks',
          populate: [
            { path: 'chapters' , populate: [{ path: 'likes'} ,{ path: 'comments'}]},
            { path: 'ratings' }
          ]
        },
        { path: 'likes', populate: { path: 'user' } },
        { path: 'comments', populate: { path: 'chapters' } },
      ]);
      console.log(user);
      if(!user.active) return null;
      return user;
    },
    
  },
  Mutation: {
    signup: async (parent,{ userInput:{email,password,name}}, {authUser, User}, info) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error('User exists already!');
        throw error;
      }
      const hashedPw = await bcrypt.hash(password, 12);
      
      const user = new User({
        email: email,
        name: name,
        password: hashedPw,
      });

      const createdUser = await user.save();
      
      const token = generateToken(createdUser, process.env.JWT_SECRET)
      return {
        token
      }
    },
    signin: async (parent, {email, password} , {authUser,User}, info) => {
      if(!email || !password) {
        throw new Error('Please provide email and password!');
      }

      const user = await User.findOne({email}).select('+password')

      if(!user){
        error = new Error('Incorrect email')
        error.code = 401;
        throw error;
      }

      const correct = await user.correctPassword(password, user.password)
      if(!correct) {
        throw new Error('Incorrect password')
      }

      const token = generateToken(user, process.env.JWT_SECRET)
      return {
        token
      }
    },
    deleteUsers: async(parent, {usersIds} , {authUser, User}, info) => {
      let count = 0;
      for(count; count < usersIds.length; count++) {
        await User.deleteOne(
          {"_id": usersIds[count]}
        )
      };
      return {
        count
      };
    },
    blockUsers: async(parent, {usersIds} , {authUser, User}, info) => {
      let count = 0;
      for(count; count < usersIds.length; count++) {
        await User.updateOne(
          {"_id": usersIds[count]}, {active: false}
        )
      };
      return {
        count
      };
    },
    unBlockUsers: async(parent, {usersIds} , {authUser, User}, info) => {
      let count = 0;
      for(count; count < usersIds.length; count++) {
        await User.updateOne(
          {"_id": usersIds[count]}, {active: true}
        )
      };
      return {
        count
      };
    } 
  },
   Subscription: {
    isUserOnline: {
      subscribe: withFilter(
        () => {
          return pubSub.asyncIterator(EVENTS.USER.IS_USER_ONLINE)},
        (payload, variables, {authUser}) =>  {
          return variables.authUserId === authUser.id
        }
      ),
    },
   }
};
