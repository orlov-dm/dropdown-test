const Constants = require('./constants');
const generateData = require('./data');

class Core {
    static async getClientData({
        startIndex = 0,
        count = 1000,   
    } = {}) {
        //TODO make custom get/set for not copying array;
        const data = await generateData;
        console.log(data[0]);
        return JSON.stringify(data.slice(startIndex, startIndex + count), function(key, value) {
            if(key === Constants.USER_FIELD_USER_URL) return undefined;
            return value;
        });
    }
}

module.exports = Core;