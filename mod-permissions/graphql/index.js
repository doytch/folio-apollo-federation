const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const { filterOkapiHeaders } = require('../../okapi-apollo-utils');

const PermissionsAPI = require('./PermissionsAPI');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
  schema: buildFederatedSchema([{
    typeDefs,
    resolvers,
  }]),
  dataSources: () => ({
    permissionsAPI: new PermissionsAPI(),
  }),
  context: ({ req }) => ({
    okapiHeaders: filterOkapiHeaders(req)
  }),
});

server.listen(4002).then(({ url }) => {
    console.log(`🚀 Permissions GraphQL server ready at ${url}`);
});

;