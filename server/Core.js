const Constants = require('./constants');
const generateData = require('./data');

let data = null;
generateData.then(generatedData => Core.setData(generatedData));

class Core {
    static setData(data) {
        Core.data = data;
    }
    static async getData({
        startIndex,
        count,
    } = {}) {
        //TODO make custom get/set for not copying array;
        const data = Core.data;
        const endIndex = startIndex + count;        
        console.log(data.length, startIndex, endIndex);
        return data.slice(startIndex, (endIndex > data.length ? data.length : endIndex));
    }

    static parseClientData(data) {        
        return JSON.stringify(data, function(key, value) {
            if(key === Constants.USER_FIELD_USER_URL) return undefined;
            return value;
        });
    }
}

module.exports = Core;