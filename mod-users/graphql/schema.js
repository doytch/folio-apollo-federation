const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    users(limit: Int = 100): [User]
    user(id: String): User
    numUsers: Int
  }

  type User @key(fields: "id") {
    id: ID!
    username: String
    barcode: String
  }
`;

module.exports = typeDefs;