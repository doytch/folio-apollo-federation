const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const axios = require('axios');

const filterOkapiHeaders = require('./filterOkapiHeaders');

const okapiToken = require('../okapi-token');

class OkapiApolloServer {
  constructor(props) {
    const {
      dataSources,
      moduleId,
      okapiUrl,
      okapiTenant,
      port,
      resolvers,
      typeDefs,
    } = props;

    this.moduleId = moduleId;
    this.okapiUrl = okapiUrl;
    this.okapiTenant = okapiTenant;
    this.port = port;

    this.server = new ApolloServer({
      schema: buildFederatedSchema([{
        typeDefs,
        resolvers,
      }]),
      dataSources,
      context: ({ req }) => ({
        okapiHeaders: {
          'x-okapi-token': okapiToken,
          ...filterOkapiHeaders(req),
          'x-okapi-url': 'https://folio-snapshot-okapi.dev.folio.org',
        }
      }),
    });
  }

  listen = () => {
    this.server.listen(this.port).then(({ url }) => {
      console.log(`🚀 ${this.moduleId} GraphQL server ready at ${url}`);

      axios
        .post(`${this.okapiUrl}/service-list`, { name: this.moduleId }, { headers: { 'x-okapi-tenant': this.okapiTenant } })
        .then(response => console.log(`✅ Registered with Apollo Gateway as ${JSON.stringify(response.data)}`))
        .catch(error => console.error(`🛑 Failed to register with Apollo Gateway: ${error?.response?.data ?? error.message}`));
    });
  }
}

module.exports = OkapiApolloServer;
