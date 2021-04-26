# Folio Apollo Federation POC

## Purpose

This workspace demonstrates the usage of [Apollo Federation](https://www.apollographql.com/docs/federation/) within a Folio system. It consists of an Apollo Gateway and separate Apollo GraphQL servers for each module that wants to support GraphQL. Those modules can either offer new queries and types, or transparently extend existing types in the graph.

## Usage

1. Log into https://folio-snapshot.dev.folio.org and copy the x-okapi-token into `okapi-token.js`. This demo uses folio-snapshot as the backing store of modules. To do so, it overrides `x-okapi-url` headers with the Snapshot Okapi's URL. You technically do not _need_ to copy the token into `okapi-token.js` - specifying it via an `x-okapi-token` header in your queries like normal is fine. This is just a time-saving convenience for this demo and enables the sample `query-extended-user` script to work.
1. Start Okapi: `cd okapi && mvn install -DskipTests && mvn exec:exec`
1. Start Apollo Gateway: `cd mod-apollo-federation-gateway && npm install && npm start`
1. Start mod-users-graphql: `cd mod-users/graphql && npm install && npm start`
1. Start mod-permissions-graphql: `cd mod-permissions/graphql && npm install && npm start`
1. Add modules to Okapi: `./startup.sh`
1. To test everything works, run a sample query: `./query-extended-user`

## How It Works

This workspace consists of an Apollo Federation Gateway (mod-apollo-federation-gateway) and two Apollo Federation Services (mod-permissions-graphql and mod-users-graphql). For an overview of [how Apollo Federation works, see its docs](https://www.apollographql.com/docs/federation/). Federated service discovery is the novel bit of work here. Essentially, what we're doing is providing the core feature of Apollo Studio within the Folio architecture: providing a way for the gateway server to dynamically update its list of Federation services.

### `apollo-federation-gateway` Interface

mod-apollo-federation-gateway provides the `apollo-federation-gateway` interface. This interface has endpoints to support CRUD operations on the list of Federation services that the Gateway is handling. Whenever the service list is updated, the gateway reboots and rebuilds the composite schema from the federated services. These endpoints are used by services such as mod-users-graphql when they are enabled for a tenant, so that they can notify the gateway of their existence via a POST to that endpoint.

### `apollo-federation-service` Interface

mod-users-graphql and mod-permissions-graphql provide the `apollo-federation-service` interface, which is a `multiple` interface type. When it's enabled for a tenant, the gateway queries Okapi (using the `provide` query param) to determine which already-installed modules implement the `apollo-federation-service` interface and add them to its service list. Subsequent GraphQL requests from the gateway to the service are routed using the module ID which was either provided by the module when it was added to the tenant, or discovered by the gateway itself when querying Okapi.
