const Utilities = require('./../utilities');
const axios = require('axios');

class Image {
  constructor(url, type, icon) {
    this.url = url;
    this.type = type;
    this.icon = icon;
  }

  async download(path, width = 400, type = 'avatar') {
    if (type === 'CREATED') {
      await Utilities.sleep(3000);
    } else {
      this.url = `https://characterai.io/i/${width}/static/${this.icon}/${this.url}`;
    }

    const response = await axios.get(this.url);
    return response.data;
  }
}

module.exports = { Image };
