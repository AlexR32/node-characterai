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

  async neoPing() {
    const data = await this.client.utils.request('get', 'ping/', null, true);
    if (data.status === 'pong') return true;
    return false;
  }

  async apiPing() {
    const data = await this.client.utils.request('get', 'api/ping/');
    if (data.status === 'OK') return true;
    return false;
  }

  async getVoices() {
    const data = await this.client.utils.request('chat/character/voices/', null);
    return data.voices;
  }

  // https://neo.character.ai/multimodal/api/v1/sessions/joinOrCreateSession post

  // https://plus.character.ai/chat/user/settings/ get // shows voice overrides

  // https://neo.character.ai/multimodal/api/v1/voices/${voiceId}?useSearch=true get // useSearch optional

  // https://plus.character.ai/chat/character/${externalId}/voice_override/delete/ post

  // https://plus.character.ai/chat/character/${externalId}/voice_override/ get

  // https://neo.character.ai/multimodal/api/v1/voices/system get

  // https://neo.character.ai/multimodal/api/v1/voices/user get
}

module.exports = Other;
