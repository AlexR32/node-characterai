const Method = require('./../types/method');

class Rooms extends Method {
  async create(name, chars, topic) {
    const data = await this.client.utils.request('post', 'chat/room/create/', {
      'characters': chars,
      'name': name,
      'topic': topic,
      'visibility': 'PRIVATE',
    });

    return data.room.external_id;
  }

  async recent() {
    const data = await this.client.utils.request('get', 'chat/rooms/recent/');
    return data.rooms;
  }
}

module.exports = Rooms;
