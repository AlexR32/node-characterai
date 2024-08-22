const Method = require('./../types/method');

class Users extends Method {
  async getUser(username) {
    const data = await this.client.utils.request('post', 'chat/user/public/', {
      username: username,
    });

    if (data.public_user.length === 0) {
      return new Error(`User ${username} not found`);
    }

    return data.public_user;
  }
}

module.exports = Users;
