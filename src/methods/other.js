const Method = require('./../types/method');

class Other extends Method {
  async createImage(prompt) {
    const data = await this.client.utils.request('chat/generate-image/', {
      'image_description': prompt,
    });

    // TODO: use image class
    return data;
  }

  async uploadImage(file) {
    const data = await this.client.utils.request('chat/user/', {});
    // TODO: use image class
    /*
    mp = CurlMime()
        mp.addpart(
            name='image',
            content_type='image/png',
            filename=file,
            local_path=file,
        )

        data = self.request(
            'chat/upload-image/',
            data={}, multipart=mp,
            token=token
        )

        return other.Image(
            url=data['value']
        )
    */
    return data;
  }

  async ping() {
    const data = await this.client.utils.request('ping/', {}, true);
    if (data.status === 'pong') return true;
    return false;
  }

  async getVoices() {
    const data = await this.client.utils.request('chat/character/voices/', {});
    return data.voices;
  }
}

module.exports = Other;
