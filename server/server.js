const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const models = require('./models');
const schema = require('./schema');
const resolvers = require('./resolvers');
const createApolloServer = require('./utils/apollo-server');
const { graphqlUploadExpress } = require('graphql-upload')



const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

mongoose
  .connect('mongodb+srv://Nikita:lIbWU46EBZgfNqXx@cluster0.xekb4.mongodb.net/assigment4?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    autoIndex: false
  })
  .then(() => console.log('DB connected'))
  .catch((err) => console.error(err));

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true }));
const corsOptions = {
  // origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

// app.use(express.static(`${__dirname}../../client/build`));
const server = createApolloServer(schema, resolvers, models);
server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});

