const Constants = require('./constants');
class User {
  constructor({
    userURL,
    ...data
  }) {
    this.clientData = data;
    this.userURL = userURL;
  }

  get clientData() {
    return this.clientData;
  }

  set clientData(data) {
    this.data = data;
  }

  get fullData() {
    return {
      ...this.clientData,
      userURL: this.userURL
    };
  }
}

module.exports = User;