const Constants = require('./constants');
const generateData = require('./data');
const { transliterate, langReverse } = require('./common');

generateData(0, 10000).then(generatedData => Core.setData(generatedData));

class Core {
  static setData(data) {
    Core.data = data;
    console.log('Rest data ' + data.length);
  }
  static async getData({
    startIndex,
    count,
    query = null
  } = {}) {
    const data = Core.data;
    if (!data) {
      return 'Data is not ready';
    }
    if (startIndex < 0) {
      return 'Wrong index';
    }
    const result = [];
    const filterRegexps = Core.getFilters(query);
    for(let i = startIndex; i < data.length; ++i) {
      const row = data[i];
      if(!Core.isRowValid(row, Constants.FILTER_FIELDS, filterRegexps)) {
        continue;
      }
      row.index = i;
      result.push(row);
      if(result.length >= count) {
        break;
      }
    }
    return result;
  }

  static parseClientData(data) {
    return JSON.stringify(data, function (key, value) {
      if (key === Constants.USER_FIELD_USER_URL) return undefined;
      return value;
    });
  }

  static isRowValid(row, filterFields, filterRegexps) {
    if(filterRegexps == null) {
      return true;
    }
    for(const field of filterFields) {
      if(!row.data.hasOwnProperty(field) || row.data[field] == null) {
        continue;
      }
      const checkValue = row.data[field].toLowerCase();
      for(const filterRegexp of filterRegexps) {
        if(filterRegexp.test(checkValue)) {
          return true;
        }
        //only check for basic string
        if(field === Constants.USER_FIELD_USER_URL) {
          break;
        }
      };
    }
  }

  static getFilters(query = null) {
    if(query == null) {
      return null;
    }
    query = Core.prepareQuery(query);
    const filterRegexps = [];
    const transliteratedQuery = transliterate(query);
    const reversedQuery = langReverse(query);
    const reversedTransliteratedQuery = langReverse(transliteratedQuery);
    filterRegexps.push(new RegExp('.*' + query + '.*'));
    filterRegexps.push(new RegExp('.*' + transliteratedQuery + '.*'));
    filterRegexps.push(new RegExp('.*' + reversedQuery + '.*'));
    filterRegexps.push(new RegExp('.*' + reversedTransliteratedQuery + '.*'));
    return filterRegexps;
  }

  static prepareQuery(query) {
    query = query.trim().toLowerCase();
    return query;
  }
}
Core.data = null;

module.exports = Core;