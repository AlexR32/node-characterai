const Method = require('./../types/method');

class Recent extends Method {
  async getRecentChats() {
    const data = await this.client.utils.request('get', 'chat/characters/recent/');
    return data.character;
  }

  async getRecentRooms() {
    const data = await this.client.utils.request('get', 'chat/rooms/recent/');
    return data.rooms;
  }

  async getRecent() {
    const data = await this.client.utils.request('get', 'chats/recent/', null, true);
    return data.chats;
  }
}

module.exports = Recent;
