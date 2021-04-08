const resolvers = {
  Query: {
    me() {
      return { id: "24d614e2-bfb3-4a2b-9fc7-61705da85f3e", username: "diku_admin" }
    },
    users(_, { limit }, context) {
      return context.dataSources.usersAPI.getUsers({ limit });
    },
    user(_, { id }, context) {
      return context.dataSources.usersAPI.getUser(id);
    },
    numUsers(_, __, context) {
      return context.dataSources.usersAPI.getNumUsers();
    }
  },
  User: {
    __resolveReference(user, context){
      return context.dataSources.usersAPI.get(user.id)
    }
  }
}

module.exports = resolvers;
