const Method = require('./../types/method');
const { v4: uuidv4 } = require('uuid');

class Account extends Method {
  async getMe() {
    const data = await this.client.utils.request('get', 'chat/user/');
    return data;
  }

  async editAccount(username, name, bio) {
    const user = this.getMe();

    const settings = {
      'avatar_type': 'UPLOADED',
      'bio': bio || user.user.bio,
      'name': name || user.user.name,
      'username': username || user.user.user.username,
    };

    await this.client.utils.request('post', 'chat/user/update/', settings);
    return true;
  }

  async getPersonas() {
    const data = await this.client.utils.request('get', 'chat/personas/?force_refresh=1');
    return data.personas;
  }

  async createPersona(title, definition, customId) {
    const identifier = customId || `id:${uuidv4()}`;

    const data = await this.client.utils.request('post', 'chat/persona/create/', {
      'title': title,
      'name': title,
      'identifier': identifier,
      'categories': [],
      'visibility': 'PUBLIC',
      'copyable': false,
      'description': 'This is my persona.',
      'greeting': 'Hello! This is my persona',
      'definition': definition,
      'avatar_rel_path': '',
      'img_gen_enabled': false,
      'strip_img_prompt_from_msg': false,
    });

    return data.persona;
  }

  async getPersona(personaId) {
    const data = await this.client.utils.request('get', `chat/persona/?id=${personaId}`);
    return data.persona;
  }

  async deletePersona(personaId) {
    const persona = this.getPersona(personaId);
    const data = await this.client.utils.request('post', 'chat/persona/update/', {
      'archived': true,
      'persona': persona,
    });

    return data.persona;
  }

  async followers() {
    const data = await this.client.utils.request('get', 'chat/user/public/followers/');
    return data.followers;
  }

  async following() {
    const data = await this.client.utils.request('get', 'chat/user/public/following/');
    return data.following;
  }

  async characters() {
    const data = await this.client.utils.request('get', 'chat/characters/?scope=user');
    return data.characters;
  }
}

module.exports = Account;
