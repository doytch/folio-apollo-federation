const { RemoteGraphQLDataSource } = require('@apollo/gateway');

class OkapiModuleDataSource extends RemoteGraphQLDataSource {
  constructor(props) {
    super(props);

    this.name = props.name;
    this.tenant = props.tenant;
    this.url = props.url;
  }

  willSendRequest({ request, context }) {
    console.log('\nwillSendRequest')

    // Take all of the Okapi-related headers and pass them along.
    Object.entries(context?.okapiHeaders ?? {}).forEach(([key, value]) => {
      console.log(`${key}: ${value}`)
      request.http.headers.set(key, value);
    });

    console.log(request);
    console.log({ name: this.name, tenant: this.tenant })
    // console.log(this.name);
    // console.log(this.url);
    // console.log(this.tenant);

    request.http.headers.set('x-okapi-module-id', this.name);
    request.http.headers.set('x-okapi-tenant', this.tenant);
  }
}

module.exports = OkapiModuleDataSource;
