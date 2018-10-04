const Constants = require('./constants');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function mapString(text, origDict, mapDict) {
  let result = text;
  for (i = 0; i < origDict.length; ++i) {
    if (origDict[i]) {
      const regex = new RegExp(escapeRegExp(origDict[i]), 'g')
      result = result.replace(regex, mapDict[i]);
    }
  }
  return result
}

function transliterate(text) {
  let origDict = null, mapDict = null;

  //cyrillic
  if (/[а-яА-ЯЁё]/.test(text)) {
    origDict = Constants.DICTIONARIES_UPPER['ru'].concat(Constants.DICTIONARIES['ru']);
    mapDict = Constants.DICTIONARIES_UPPER['en'].concat(Constants.DICTIONARIES['en']);
  } else {
    origDict = Constants.DICTIONARIES_UPPER['en'].concat(Constants.DICTIONARIES['en']);
    mapDict = Constants.DICTIONARIES_UPPER['ru'].concat(Constants.DICTIONARIES['ru']);;
  }
  return mapString(text, origDict, mapDict);
}

//TODO make case sensitive if needed
function langReverse(text) {
  let origDict = null, mapDict = null;

  //cyrillic
  if (/[а-яА-ЯЁё]/.test(text)) {
    origDict = Constants.DICTIONARIES_REVERSE['ru'];
    mapDict = Constants.DICTIONARIES_REVERSE['en'];
  } else {
    origDict = Constants.DICTIONARIES_REVERSE['en'];
    mapDict = Constants.DICTIONARIES_REVERSE['ru'];
  }
  return mapString(text, origDict, mapDict);
}

module.exports.transliterate = transliterate;
module.exports.langReverse = langReverse;