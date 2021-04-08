const { gql } = require('apollo-server');

const typeDefs = gql`
  extend type User @key(fields: "id") {
    id: ID! @external
    permissions: [String]
  }
`;

module.exports = typeDefs;