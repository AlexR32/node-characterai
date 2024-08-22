const Method = require('./../types/method');

class Chats extends Method {
  async search(query) {
    const data = await this.client.utils.request('get', `chat/characters/search/?query=${query}`);
    return data.characters;
  }

  async createRoom(name, chars, topic) {
    const data = await this.client.utils.request('post', 'chat/room/create/', {
      'characters': chars,
      'name': name,
      'topic': topic,
      'visibility': 'PRIVATE',
    });

    return data.room.external_id;
  }
}

module.exports = Chats;
