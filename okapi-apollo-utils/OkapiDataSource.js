const { RESTDataSource } = require('apollo-datasource-rest');

class OkapiDataSource extends RESTDataSource {
  willSendRequest(request) {
    const { okapiHeaders } = this.context;
    if (!okapiHeaders) {
      throw 'OkapiDataSource: No Okapi headers defined while trying to pass auth headers!';
    }

    request.headers.set('x-okapi-tenant', okapiHeaders['x-okapi-tenant']);
    request.headers.set('x-okapi-token', okapiHeaders['x-okapi-token']);
  }

  get baseURL() {
    const { okapiHeaders } = this.context;
    if (!okapiHeaders) {
      throw 'OkapiDataSource: No Okapi headers defined while trying to construct baseURL!';
    }

    return `${okapiHeaders['x-okapi-url']}/`;
  }
}

module.exports = OkapiDataSource;

