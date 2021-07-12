const bcrypt = require('bcryptjs')
const { withFilter } = require('apollo-server');
const {pubSub, EVENTS} = require('../subscription');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/email');
const checkAuthorization = require('../utils/checkAuthorization');

exports.user = {
  Query: {
    allUsers: async (parent, args, {authUser, User}) => {
       const artworks = await User.find().populate([
          {path: 'artworks'},
          {path: 'likes'},
          {path: 'coments'},
          {
           path: 'ratings',
           populate: ['user', 'artwork']
          },
        ]);
       return artworks
    },
    getAuthUser: async (root, args, {authUser, User }) => {
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
      if(!user) {
        throw new Error('This user does not exist')
      }
      if(user.role !== 'admin'){
        if(!user.active) {
          throw new Error('you are banned')
        }
      }
      return user;
    },
    isConfirmUserMail: async (root, {token}, { authUser, User }) => {
      const confirmUser = await checkAuthorization(token);
    if (!confirmUser) {
      return {
        isConfirm: false
      };
    }

    await User.findOneAndUpdate({ _id: confirmUser.id }, { isMailConfirm: true });

    return {
      isConfirm: true
    };
    }
    
  },
  Mutation: {
    firstLogin:async (parent,{preference = []}, {authUser, User}) => {
      if(!preference.length){
        throw new Error('You must choose your preferences')
      }
      await User.findOneAndUpdate({ _id: authUser.id }, { $push: { preference} });
      await User.findOneAndUpdate({ _id: authUser.id }, { isFirstLogin: false });
      return { message: 'Thank You'}
    },
    updatePrefence: async(parent,{preference = []}, {authUser, User}) => {
      if(!preference.length){
        throw new Error('You must choose your preferences')
      }
      const updatedUser = await User.findOneAndUpdate({ _id: authUser.id }, { preference }, { new: true })
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
      return updatedUser
    },
    signup: async (parent,{ userInput:{email,password,name}}, {req,authUser, User}) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error('User exists already!');
        throw error;
      }
      const hashedPw = await bcrypt.hash(password, 12);
      
      const user = new User({
        email,
        name,
        password: hashedPw,
      });

      const createdUser = await user.save();
      
      const token = generateToken(createdUser, process.env.JWT_SECRET)

      const createUrl = async (token, id) => {
        const URLDeploy = `${req.protocol}://${req.get('host')}/confirm/${token}`;
        return URLDeploy
      }

      await sendEmail({
        email: user.email,
        subject: 'Confirm Email',
        url: await createUrl(token, createdUser.id),
      } )

      return {
        message: 'An activation email has been sent to your email'
      }
    },
    signin: async (parent, {email, password} , {authUser,User}) => {
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

      if(user.role !== 'admin'){
        if(!user.isMailConfirm) {
          throw new Error('You need to confirm your email')
        }
      }

      const token = generateToken(user, process.env.JWT_SECRET)
      return {
        token
      }
    },
    deleteUsers: async(parent, {usersIds} , {authUser, User}) => {
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
    blockUsers: async(parent, {usersIds} , {authUser, User}) => {
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
    unBlockUsers: async(parent, {usersIds} , {authUser, User}) => {
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
