const resolvers = {
  User: {
    permissions(user, _, context) {
      return context.dataSources.permissionsAPI.getPermissionsForUserId(user.id)
    }
  },
}

module.exports = resolvers;
