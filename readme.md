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
1. Restart mod-users-graphql and mod-permissions-graphql by navigating to their console, typing `rs` and hitting `Return`. Note, this shouldn't be necessary once they implement the `tenant` API.
1. To test everything works, run a sample query: `./query-extended-user`

