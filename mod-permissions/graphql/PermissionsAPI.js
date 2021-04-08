const { OkapiDataSource } = require('../../okapi-apollo-utils');

class UsersAPI extends OkapiDataSource {
  async getPermissionsForUserId(userId) {
    const response = await this.get(`perms/users/${userId}`, { indexField: 'userId' });
    return response.permissions;
  }
}

module.exports = UsersAPI;

