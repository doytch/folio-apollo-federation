const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const axios = require('axios');

const { filterOkapiHeaders } = require('../../okapi-apollo-utils');

const UsersAPI = require('./UsersAPI');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const okapiToken = require('../../okapi-token');

const PORT = 4001;
const OKAPI_URL = 'http://localhost:9130';
const OKAPI_TENANT = 'diku';

const server = new ApolloServer({
  schema: buildFederatedSchema([{
    typeDefs,
    resolvers,
  }]),
  dataSources: () => ({
    usersAPI: new UsersAPI(),
  }),
  context: ({ req }) => ({
    okapiHeaders: {
      'x-okapi-token': okapiToken,
      ...filterOkapiHeaders(req),
      'x-okapi-url': 'https://folio-snapshot-okapi.dev.folio.org',
    }
  }),
});

server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Users GraphQL server ready at ${url}`);

  axios
    .post(`${OKAPI_URL}/service-list`, { name: 'mod-users-graphql-1.0.0' }, { headers: { 'x-okapi-tenant': OKAPI_TENANT } })
    .then(response => console.log(`✅ Registered with Apollo Gateway as ${JSON.stringify(response.data)}`))
    .catch(error => console.error(`🛑 Failed to register with Apollo Gateway: ${error?.response?.data ?? error.message}`));
});

;