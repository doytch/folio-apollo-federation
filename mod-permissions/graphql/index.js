const { OkapiApolloServer } = require('../../okapi-apollo-utils');

const PermissionsAPI = require('./PermissionsAPI');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new OkapiApolloServer({
  dataSources: () => ({
    permissionsAPI: new PermissionsAPI(),
  }),
  moduleId: 'mod-permissions-graphql-1.0.0',
  okapiUrl: 'http://localhost:9130',
  okapiTenant: 'diku',
  port: 4002,
  resolvers,
  typeDefs,
});

server.listen();
