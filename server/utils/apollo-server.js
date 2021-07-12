const { ApolloServer } = require('apollo-server-express');
const {pubSub, EVENTS} = require('../subscription');
const checkAuthorization = require('./checkAuthorization');




module.exports = createApolloServer = (typeDefs, resolvers, models) => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    uploads: false,
    context: async ({ req, connection }) => {
      if (connection) {
        return connection.context;
      }
      let authUser = null;
      // req.headers.authorization &&  remove before deployment req.headers.authorization !!!hak
      if (req.headers.authorization && req.headers.authorization !== 'null') {
        const user = await checkAuthorization(req?.headers?.authorization);
        if (user) {
          authUser = user;
        }
      }
      
      return Object.assign({authUser}, {req}, models, pubSub);
    },
    subscriptions: {
      onConnect: async (connectionParams, webSocket, context) => {
        if (connectionParams.authorization) {
          const authUser = await checkAuthorization(connectionParams.authorization);

          pubSub.publish(EVENTS.USER.IS_USER_ONLINE, {
            isUserOnline: {
              userId: authUser.id,
              isOnline: true,
            },
          });
          return {authUser}
        }
      },
      onDisconnect: async (webSocket, context) => {
        const c = await context.initPromise;
        if (c && c.authUser) {
          pubSub.publish(EVENTS.USER.IS_USER_ONLINE, {
            isUserOnline: {
              userId: c.authUser.id,
              isOnline: false,
            },
          });

   
          await models.User.findOneAndUpdate(
            { email: c.authUser.email },
            {
              isOnline: false,
            }
          );
        }
      },
    },
  });
};