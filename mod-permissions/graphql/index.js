const { OkapiApolloServer } = require('../../okapi-apollo-utils');

const PermissionsAPI = require('./PermissionsAPI');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new OkapiApolloServer({
  dataSources: () => ({
    permissionsAPI: new PermissionsAPI(),
  }),
  port: 4002,
  resolvers,
  typeDefs,
});

server.listen();
