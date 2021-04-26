const ServiceList = require('../ServiceList');

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
  const serviceList = ServiceList.add(service);

  console.log(`Added service: ${service.name}`);

  res.status(200);
  res.send(JSON.stringify(service, null, '\t'));
  res.end();

  return serviceList;
}

const handleServiceListDelete = async (req, res) => {
  const service = parseServiceFromRequest(req, res);
  const serviceList = ServiceList.delete(service);

  console.log(`Removed service: ${service.name}`);

  res.status(200);
  res.end();

  return serviceList;
}

const handleServiceListGet = (req, res) => {
  res.status(200);
  res.send(JSON.stringify(serviceList, null, '\t'));
  res.end();
};

module.exports = {
  GET: handleServiceListGet,
  POST: handleServiceListPost,
  DELETE: handleServiceListDelete,
}
