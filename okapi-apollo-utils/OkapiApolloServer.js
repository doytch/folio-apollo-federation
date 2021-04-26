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
      const { body: { module_from, module_to } } = req;

      if (module_from) {
        console.log(`⏬  Okapi has notified us we've been deactivated as ${module_from}`);
        this.unregister(module_from, req.headers['x-okapi-url'], req.headers['x-okapi-tenant']);
      }

      if (module_to) {
        console.log(`⏫  Okapi has notified us we've been activated as ${module_to}`);
        this.register(module_to, req.headers['x-okapi-url'], req.headers['x-okapi-tenant']);

        this.moduleId = module_to;
      }

      res.status(204);
      res.end();
    });

    this.app = app;
  }

  register = async (moduleId, okapiUrl, okapiTenant) => {
    axios
      .post(`${okapiUrl}/service-list`, { name: moduleId }, { headers: { 'x-okapi-tenant': okapiTenant } })
      .then(response => console.log(`✅ Registered with Apollo Gateway as ${JSON.stringify(response.data)}`))
      .catch(error => console.error(`🛑 Failed to register with Apollo Gateway: ${error?.response?.data ?? error.message}`));
  }

  unregister = async (moduleId, okapiUrl, okapiTenant) => {
    axios
      .delete(`${okapiUrl}/service-list`, { headers: { 'x-okapi-tenant': okapiTenant }, data: { name: moduleId } })
      .then(() => console.log(`✅ Deregistered with Apollo Gateway as ${moduleId}`))
      .catch(error => console.error(`🛑 Failed to deregister with Apollo Gateway: ${error?.response?.data ?? error.message}`));
  }

  listen = () => {
    this.app.listen({ port: this.port }, () => {
      console.log(`🚀 GraphQL server is up and listening...`);

      if (this.defaultOkapiTenant && this.defaultOkapiUrl) {
        this.registerWithGateway(this.defaultthis.defaultOkapiUrl, this.defaultOkapiTenant);
      }
    });
  }
}

module.exports = OkapiApolloServer;
