const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware} = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// create new Apollo server and pass in schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// start Apollo server
await server.start();

// integrate Apollo server with express app as middleware
server.applyMiddleware({ app });

// log link to test GQL API
console.log(`Use GraphQL at http://locahost:${PORT}${server.graphqlPath}`);

// initialize Apollo server
startServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
