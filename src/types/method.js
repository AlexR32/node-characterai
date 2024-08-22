class Method {
  constructor(client) {
    this._client = client;
  }

  get client() {
    return this._client;
  }
}

module.exports = Method;
