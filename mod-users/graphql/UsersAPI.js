const { OkapiDataSource } = require('../../okapi-apollo-utils');

class UsersAPI extends OkapiDataSource {
  async getUsers({ limit = 100 }) {
    const response = await this.get('users', { limit });
    return response.users;
  }

  async getUser(userId) {
    return this.get(`users/${userId}`);
  }

  async getNumUsers() {
    const response = await this.get('users', { limit: 1 });
    return response.totalRecords;
  }
}

module.exports = UsersAPI;

