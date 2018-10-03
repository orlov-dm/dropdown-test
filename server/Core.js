const Constants = require('./constants');
const generateData = require('./data');

generateData(0, 10000).then(generatedData => Core.setData(generatedData));

class Core {
  static setData(data) {
    Core.data = data;
    console.log('Rest data ' + data.length);
  }
  static async getData({
    startIndex,
    count
  } = {}) {
    const data = Core.data;
    if (!data) {
      return 'Data is not ready';
    }
    if (startIndex < 0) {
      return 'Wrong index';
    }
    const endIndex = startIndex + count;
    //TODO make custom get/set for not copying array;
    return data.slice(startIndex, (endIndex > data.length ? data.length : endIndex));
  }

  static parseClientData(data) {
    return JSON.stringify(data, function (key, value) {
      if (key === Constants.USER_FIELD_USER_URL) return undefined;
      return value;
    });
  }  
}
Core.data = null;

module.exports = Core;