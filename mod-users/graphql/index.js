const { OkapiApolloServer } = require('../../okapi-apollo-utils');

const UsersAPI = require('./UsersAPI');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new OkapiApolloServer({
  dataSources: () => ({
    usersAPI: new UsersAPI(),
  }),
  port: 4001,
  resolvers,
  typeDefs,
});

server.listen();
