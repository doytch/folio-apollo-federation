const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const { filterOkapiHeaders } = require('../../okapi-apollo-utils');

const UsersAPI = require('./UsersAPI');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
  schema: buildFederatedSchema([{
    typeDefs,
    resolvers,
  }]),
  dataSources: () => ({
    usersAPI: new UsersAPI(),
  }),
  context: ({ req }) => ({
    okapiHeaders: filterOkapiHeaders(req)
  }),
});

server.listen(4001).then(({ url }) => {
    console.log(`🚀 Users GraphQL server ready at ${url}`);
});

;