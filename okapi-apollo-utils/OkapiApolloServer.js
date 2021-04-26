const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { buildFederatedSchema } = require('@apollo/federation');
const axios = require('axios');

const filterOkapiHeaders = require('./filterOkapiHeaders');

const okapiToken = require('../okapi-token');

class OkapiApolloServer {
  constructor(props) {
    const {
      dataSources,
      moduleId,
      defaultOkapiUrl,
      defaultOkapiTenant,
      port,
      resolvers,
      typeDefs,
    } = props;

    this.moduleId = moduleId;
    this.defaultOkapiUrl = defaultOkapiUrl;
    this.defaultOkapiTenant = defaultOkapiTenant;
    this.port = port;

    const app = express();
    app.use(express.json());

    const server = new ApolloServer({
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

    server.applyMiddleware({ app });

    app.post('/_/tenant', async (req, res) => {
      console.log('Received notification of activation from Okapi via _tenant interface...');
      this.registerWithGateway(req.headers['x-okapi-url'], req.headers['x-okapi-tenant']);
      res.status(204);
      res.end();
    });

    this.app = app;
  }

  registerWithGateway = async (okapiUrl, okapiTenant) => {
    axios
      .post(`${okapiUrl}/service-list`, { name: this.moduleId }, { headers: { 'x-okapi-tenant': okapiTenant } })
      .then(response => console.log(`✅ Registered with Apollo Gateway as ${JSON.stringify(response.data)}`))
      .catch(error => console.error(`🛑 Failed to register with Apollo Gateway: ${error?.response?.data ?? error.message}`));
}

  listen = () => {
    this.app.listen({ port: this.port }, () => {
      console.log(`🚀 ${this.moduleId} GraphQL server is up and listening...`);

      if (this.defaultOkapiTenant && this.defaultOkapiUrl) {
        this.registerWithGateway(this.defaultOkapiUrl, this.defaultOkapiTenant);
      }
    });
  }
}

module.exports = OkapiApolloServer;
