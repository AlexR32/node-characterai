const Method = require('./../types/method');

class Users extends Method {
  async getUser(username) {
    const data = await this.client.utils.request('post', 'chat/user/public/', {
      username: username,
    });

    if (data.public_user) {
      return new Error(`User ${username} not found`);
    }

    return data.public_user;
  }

  async followers(username, page = 1) {
    const data = await this.client.utils.request('post', 'chat/user/public/following/', {
      username: username,
      pageParam: page,
    });

    return data;
  }

  async following(username, page = 1) {
    const data = await this.client.utils.request('post', 'chat/user/public/following/', {
      username: username,
      pageParam: page,
    });

    return data;
  }
}

module.exports = Users;
