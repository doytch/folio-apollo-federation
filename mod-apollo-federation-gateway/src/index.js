const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloGateway } = require('@apollo/gateway');
const { createHttpTerminator } = require('http-terminator');

const OkapiModuleDataSource = require('./OkapiModuleDataSource');
const { filterOkapiHeaders } = require('../../okapi-apollo-utils');

let serviceList = [
  // { name: 'users', url: 'http://localhost:4001', tenant: 'diku' },
  // { name: 'permissions', url: 'http://localhost:4002', tenant: 'diku' },
];

let httpTerminator;

const parseServiceFromRequest = (req, res) => {
  const name = req.body?.name;
  if (!name) {
    res.status(400);
    res.send('"name" was not defined in the POST body');
    res.end();
    return undefined;
  }

  if (!req.headers['x-okapi-url']) {
    res.status(400);
    res.send('x-okapi-url header is not defined');
    res.end();
    return undefined;
  }

  // The path `/graphql` is defined in the `pathPattern` of the `graphql-module` interface.
  const url = `${req.headers['x-okapi-url']}/graphql`;

  if (!req.headers['x-okapi-tenant']) {
    res.status(400);
    res.send('x-okapi-tenant header is not defined');
    res.end();
    return undefined;
  }

  const tenant = req.headers['x-okapi-tenant'];

  return { name, tenant, url };
}
const handleServiceListPost = async (req, res) => {
  const service = parseServiceFromRequest(req, res);

  serviceList = serviceList.filter(s => s?.name !== service.name);
  serviceList.push(service);

  res.status(200);
  res.send(JSON.stringify(service, null, '\t'));
  res.end();

  await httpTerminator?.terminate();
  startServer();
}

const handleServiceListDelete = async (req, res) => {
  const service = parseServiceFromRequest(req, res);

  serviceList = serviceList.filter(s => s?.name !== service.name);

  res.status(200);
  res.end();

  await httpTerminator?.terminate();
  startServer();
}

const handleServiceListGet = (req, res) => {
  res.status(200);
  res.send(JSON.stringify(serviceList, null, '\t'));
  res.end();
};

const startServer = () => {
  const app = express();
  app.use(express.json()) // for parsing application/json

  if (!serviceList.length) {
    console.log('No services defined yet...not starting Apollo Gateway.')
  } else {
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

  app.get('/service-list', handleServiceListGet);
  app.post('/service-list', handleServiceListPost);
  app.delete('/service-list/', handleServiceListDelete);

  const server = app.listen({ port: 4000 });

  httpTerminator = createHttpTerminator({ server })

  console.log(`🚀 Listening on http://localhost:4000/graphql`);
};

startServer();
