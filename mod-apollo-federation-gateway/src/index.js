const axios = require('axios');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloGateway } = require('@apollo/gateway');

const OkapiModuleDataSource = require('./OkapiModuleDataSource');
const Terminator = require('./Terminator');
const { filterOkapiHeaders } = require('../../okapi-apollo-utils');
const serviceListHandlers = require('./routes/serviceList');

const APOLLO_FEDERATION_SERVICE_INTERFACE_ID = 'apollo-federation-service';

const DEFAULT_PORT = 4000;
const DEFAULT_OKAPI_URL = 'http://localhost:9130';
const DEFAULT_OKAPI_TENANT = 'diku';

const checkForServices = (okapiUrl, okapiTenant) => {
  console.log(`Checking for Apollo services at URL: ${okapiUrl} for tenant: ${okapiTenant}...`)
  return axios
    .get(`${okapiUrl}/_/proxy/tenants/${okapiTenant}/modules?provide=${APOLLO_FEDERATION_SERVICE_INTERFACE_ID}`)
    .then(response => {
      return (response?.data ?? []).map(service => ({
        name: service.id,
        tenant: okapiTenant,
        url: `${okapiUrl}/graphql`
      }));
    })
    .catch(error => console.error(`Failed to fetch existing Apollo services: ${error.message}`));
};

const startServer = (serviceList = []) => {
  const app = express();
  app.use(express.json()) // for parsing application/json

  if (!serviceList.length) {
    console.log('No services defined yet...not starting Apollo Gateway.')
  } else {
    console.log('Starting Apollo gateway with the following services:');
    console.table(serviceList);

    // Initialize an ApolloGateway instance and pass it an array of
    // your implementing service names and URLs
    const gateway = new ApolloGateway({
      serviceList,
      buildService({ name, tenant, url }) {
        return new OkapiModuleDataSource({ name, tenant, url });
      },
    });

    // Pass the ApolloGateway to the ApolloServer constructor
    const apolloServer = new ApolloServer({
      gateway,

      subscriptions: false, // Subscriptions not currently supported with ApolloGateway

      // Pass along x-okapi-* headers to the other Apollo service servers
      context: ({ req }) => ({
        okapiHeaders: filterOkapiHeaders(req),
      }),
    });

    // Add GraphQL middleware and /graphql path to the Express server
    apolloServer.applyMiddleware({ app });
  }

  app.get('/service-list', serviceListHandlers.GET);
  app.post('/service-list', (req, res) => serviceListHandlers.POST(req, res).then(serviceList => startServer(serviceList)));
  app.delete('/service-list/', (req, res) => serviceListHandlers.DELETE(req, res).then(serviceList => startServer(serviceList)));

  app.post('/_/tenant', async (req, res) => {
    console.log('Received notification of activation from Okapi via _tenant interface...');

    init(req.headers['x-okapi-url'], req.headers['x-okapi-tenant']);

    res.status(204);
    res.end();
  });

  Terminator.terminate();
  const server = app.listen({ port: DEFAULT_PORT }, () => console.log(`🚀 Listening on http://localhost:${DEFAULT_PORT}`));
  Terminator.set(server);
};

init = async (okapiUrl, okapiTenant) => {
  const services = await checkForServices(okapiUrl, okapiTenant);
  startServer(services);
}

init(DEFAULT_OKAPI_URL, DEFAULT_OKAPI_TENANT);
