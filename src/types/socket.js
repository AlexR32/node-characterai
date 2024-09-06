const Method = require('./../types/method');

const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');

class Socket extends Method {
  constructor(client) {
    super(client);

    this.socket = null;
    // this.authState = 'unauthenticated';
    this.requests = new Map();
    this.queue = [];

    this.socketTimeout = 900000;
    this.requestTimeout = 30000;
    // this.heartbeatInterval = 0;
    this.retryAttemps = 0;
    this.retryTimeout = 0;

    this.resetSocketTimeout();
    this.connect();
  }

  resetSocketTimeout() {
    if (this.socketTimeout > 0) {
      this.socketTimeout = setTimeout(() => {
        this.disconnect();
      }, this.socketTimeout);
    }

    clearTimeout(this.socketTimeout);
  }

  // async authenticate() {
  //   if (this.authState === 'unauthenticated') {
  //     try {
  //       this.authState = 'authenticating';
  //       await this.client.other.neoPing();
  //       this.authState = 'authenticated';
  //     } catch (error) {
  //       console.error('Failed to authenticate websocket', error);
  //       this.authState = 'unauthenticated';
  //     }
  //   }
  // }

  // checkAuthentication(error) {
  //   const {code, message} = error

  //   if (code === 403 || code === 401 || typeof message === 'string' && (
  //     message.includes('403') ||
  //     message.includes('401') ||
  //     message.toLowerCase().includes('unauthorized')
  //   )) {
  //     this.authState = 'unauthenticated';
  //   }
  // }

  isConnected() {
    return this.socket?.readyState === 1;
  }

  isConnectedOrConnecting() {
    return this.socket?.readyState === 1 || this.socket?.readyState === 0;
  }

  // async setup() {
  //   await this.authenticate();
  //   this.connect();
  // }

  connect() {
    this.disconnect();

    this.socket = new WebSocket('wss://neo.character.ai/ws/', {
      headers: {
        'Authorization': `Token ${this.client.token}`,
      },
    });

    this.socket.on('open', () => {
      console.log('socket connected');
      this.retryAttemps = 0;

      if (this.heartbeatInterval > 0) {
        this.heartbeatInterval = setInterval(() => {
          this.socket.send(JSON.stringify({ command: 'ping' }));
        }, this.heartbeatInterval);
      }

      while (this.queue.length > 0) {
        const requestId = this.queue.shift();
        const request = this.requests.get(requestId);

        this.socket.send(JSON.stringify(request.data), (error) => {
          if (error) {
            this.requests.delete(requestId);
            request.reject(error);
          }
        });
      }
    });

    // this.socket.on('error', () => {
    //   this.checkAuthentication();
    //   this.raiseErrorCallbacksForPendingRequests();
    // });

    this.socket.on('close', (code, reason) => {
      console.log('socket closed', code, reason.toString());

      // this.checkAuthentication();
      this.disconnect();
      // this.raiseErrorCallbacksForPendingRequests();

      this.retryTimeout = setTimeout(() => {
        this.retryAttemps++;
        this.connect();
      }, 500 * 2 ** this.retryAttemps);
    });

    this.socket.on('message', (data) => {
      try {
        this.resetSocketTimeout();
        data = JSON.parse(data);

        if (this.requests.has(data.request_id)) {
          const request = this.requests.get(data.request_id);

          if (!request.callback) {
            request.resolve(data);
            this.requests.delete(data.request_id);
            return;
          }

          // request.responses.push(data);
          if (request.callback(data)) {
            // request.resolve(request.responses);
            request.resolve(data);
            this.requests.delete(data.request_id);
          }
        }
      } catch (error) {
        console.error('Failed to process incoming message', error);
      }
    });
  }

  send(command, payload, callback) {
    return new Promise((resolve, reject) => {
      const requestId = uuidv4();
      const data = { 'command': command, 'request_id': requestId, 'payload': payload };
      this.requests.set(requestId, { resolve, reject, data, callback });

      if (this.isConnected()) {
        this.socket.send(JSON.stringify(data), (error) => {
          if (error) {
            this.requests.delete(requestId);
            reject(error);
          }
        });
      } else {
        this.queue.push(requestId);
        this.reconnect();
      }

      setTimeout(() => {
        if (this.requests.has(requestId)) {
          this.requests.delete(requestId);
          // reject(new Error(`Request timed out for requestId: ${requestId}`));
        }
      }, this.requestTimeout);
    });
  }

  reconnect() {
    if (!this.isConnectedOrConnecting()) {
      this.connect();
    }
  }

  disconnect() {
    if (this.socket) {
      clearTimeout(this.socketTimeout);
      clearTimeout(this.retryTimeout);
      // clearInterval(this.heartbeatInterval);
      // this.socket.onopen = null;
      // this.socket.onerror = null;
      // this.socket.onmessage = null;
      // this.socket.onclose = null;
      this.socket.close();
      this.socket = null;
    }
  }
}

module.exports = Socket;
