const Utilities = require('./utilities');
const { v4: uuidv4 } = require('uuid');
const Methods = require('./methods');
const WebSocket = require('ws');

class CharacterAI {
  async connect(token) {
    this.token = token;
    this.account.me = (await this.account.getMe()).user;

    this.ws = new WebSocket('wss://neo.character.ai/ws/', {
      headers: {
        'Authorization': `Token ${this.token}`,
      },
    });

    const requests = new Map();
    // this.ws.requests = requests;

    this.ws.on('message', (data) => {
      try {
        data = JSON.parse(data);

        if (requests.has(data.request_id)) {
          const request = requests.get(data.request_id);

          // TODO: add responses array and resolve it on callback, if no callback then just resolve data
          if (!request.callback) {
            request.resolve(data);
            requests.delete(data.request_id);
            return;
          }

          if (request.callback(data)) {
            request.resolve(data);
            requests.delete(data.request_id);
          }
        }
      } catch (error) {
        console.error('Failed to process incoming message', error);
      }
    });

    // this.ws.getLastMessage = (requestId) => {
    //   const request = requests.get(requestId);
    //   return request?.responses[request.responses.length - 1];
    // };

    this.ws.sendAndReceive = function sendAndReceive(command, payload, callback) {
      return new Promise((resolve, reject) => {
        const requestId = uuidv4();
        const data = { 'command': command, 'request_id': requestId, 'payload': payload };
        requests.set(requestId, { resolve, reject, callback });

        this.send(JSON.stringify(data), (error) => {
          if (error) {
            requests.delete(requestId);
            reject(error);
          }
        });

        setTimeout(() => {
          if (requests.has(requestId)) {
            requests.delete(requestId);
            // reject(new Error(`Request timed out for requestId: ${requestId}`));
          }
        }, 10000);
      });
    };

    // this.ws.on('message', (data) => {
    //   console.log(data.toString());
    // });

    this.ws.asyncOn = function(event) {
      return new Promise((resolve, reject) => {
        this.once(event, (data) => {
          try {
            if (!data) {
              resolve(undefined);
              return;
            }

            data = JSON.parse(data);
            // if data
            resolve(data);
          } catch (error) {
            reject(error);
          }
        });
      });
    };

    // this.ws.sendAndReceive = async function(command, payload) {
    //   if (this.readyState === this.CONNECTING) {
    //     await this.asyncOn('open');
    //   }

    //   const data = {
    //     'command': command,
    //     'request_id': uuidv4(),
    //     'payload': payload,
    //   };

    //   this.send(JSON.stringify(data));
    //   const response = await this.asyncOn('message');
    //   return response;
    // };

    await this.ws.asyncOn('open');
  }

  users = new Methods.Users(this);

  characters = new Methods.Characters(this);

  account = new Methods.Account(this);

  recent = new Methods.Recent(this);

  chats = new Methods.Chats(this);

  chat = new Methods.Chat(this);

  other = new Methods.Other(this);

  utils = new Utilities(this);
}

module.exports = { CharacterAI };
