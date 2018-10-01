const Constants = require('./constants');
const generateData = require('./data');

generateData(0, 1000).then(generatedData => Core.setFavouriteData(generatedData));
generateData(1000, 9000).then(generatedData => Core.setData(generatedData));

class Core {
    static setFavouriteData(data) {
        Core.favouriteData = data;
        console.log('Favourite data ' + data.length);
    }
    static setData(data) {
        Core.data = data;
        console.log('Rest data ' + data.length);
    }
    static async getData({
        startIndex,
        count,
        isFavourite = false
    } = {}) {
        //TODO make custom get/set for not copying array;
        if(isFavourite) {
            return Core.favouriteData;
        }
        if(startIndex < 0) {
            return 'Wrong index';
        }
        const data = Core.data;
        const endIndex = startIndex + count;
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