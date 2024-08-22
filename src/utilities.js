const Method = require('./types/method');
const axios = require('axios');

class Utilities extends Method {
  async request(method, url, data, isNeo, multipart) {
    const headers = {
      'Authorization': `Token ${this.client.token}`,
      // 'Content-Type': multipart ? 'multipart/form-data' : 'application/json',
    };

    url = `https://plus.character.ai/${url}`;
    if (isNeo) url = url.replace('plus', 'neo');
    if (multipart) headers['Content-Type'] = 'multipart/form-data';

    const response = await axios({
      url: url,
      method: method,
      headers: headers,
      data: data,
      withCredentials: true,
    });

    return response.data;
  }

  static sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

module.exports = Utilities;
