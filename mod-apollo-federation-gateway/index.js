const { ApolloServer } = require('apollo-server');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');

const { filterOkapiHeaders } = require('../okapi-apollo-utils');

class OkapiModuleDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    // Take all of the Okapi-related headers and pass them along.
    Object.entries(context?.okapiHeaders ?? {}).forEach(([key, value]) => {
      request.http.headers.set(key, value);
    });
  }
}

// Initialize an ApolloGateway instance and pass it an array of
// your implementing service names and URLs
const gateway = new ApolloGateway({
  serviceList: [
    { name: 'users', url: 'http://localhost:4001' },
    { name: 'permissions', url: 'http://localhost:4002' },
    // Define additional services here
  ],
  buildService({ name, url }) {
    return new OkapiModuleDataSource({ url });
  },
});

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
  gateway,

  // Disable subscriptions (not currently supported with ApolloGateway)
  subscriptions: false,

  context: ({ req }) => ({
    okapiHeaders: filterOkapiHeaders(req),
  }),
});

server.listen().then(({ url }) => {
  console.log(`🚀 Apollo Gateway server ready at ${url}`);
});

