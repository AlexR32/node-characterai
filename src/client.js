const Utilities = require('./utilities');
const Socket = require('./types/socket');
const Methods = require('./methods');

class CharacterAI {
  constructor(token) {
    this.token = token;

    this.users = new Methods.Users(this);
    this.characters = new Methods.Characters(this);
    this.account = new Methods.Account(this);
    this.chats = new Methods.Chats(this);
    this.other = new Methods.Other(this);

    this.utils = new Utilities(this);
  }

  async auth() {
    try {
      this.me = await this.account.get();
      this.ws = new Socket(this);
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        throw new Error('Unauthorized, check your token');
      }

      throw error;
    }
  }
}

module.exports = { CharacterAI };
