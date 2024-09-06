const Method = require('./types/method');
const axios = require('axios');

class Utilities extends Method {
  async request(method, url, data, isNeo, multipart) {
    const headers = {
      'Authorization': `Token ${this.client.token}`,
    };

    const baseURL = `https://${isNeo ? 'neo' : 'plus'}.character.ai/`;
    if (multipart) headers['Content-Type'] = 'multipart/form-data';

    const config = {
      baseURL: baseURL,
      url: url,
      method: method,
      headers: headers,
      data: data,
      withCredentials: true,
    };

    const response = await axios(config);
    return response.data;
  }

  static sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

module.exports = Utilities;
