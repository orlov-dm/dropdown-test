

module.exports.USER_FIELD_ID = 'id';
module.exports.USER_FIELD_NAME = 'name';
module.exports.USER_FIELD_SURNAME = 'surname';
module.exports.USER_FIELD_FULLNAME = 'fullname';
module.exports.USER_FIELD_WORKPLACE = 'workplace';
module.exports.USER_FIELD_AVATAR_URL = 'avatarUrl';
module.exports.USER_FIELD_USER_URL = 'userUrl';
module.exports.USER_FIELD_GENDER = 'gender';

module.exports.USER_FIELDS = [
  module.exports.USER_FIELD_ID,
  module.exports.USER_FIELD_NAME,
  module.exports.USER_FIELD_SURNAME,
  module.exports.USER_FIELD_FULLNAME,
  module.exports.USER_FIELD_WORKPLACE,
  module.exports.USER_FIELD_AVATAR_URL,
  module.exports.USER_FIELD_USER_URL,
  module.exports.USER_FIELD_GENDER,
];

const DICTIONARIES = {
  'en': ['eh', 'ju', 'ja', 'shh', 'ch', 'sh', 'kh', 'jo', 'zh', 'a', 'b', 'v', 'g', 'd', 'e', 'z', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'c', '', 'y', ''],
  'ru': ['э', 'ю', 'я', 'щ', 'ч', 'ш', 'х', 'ё', 'ж', 'а', 'б', 'в', 'г', 'д', 'е', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'ц', 'ъ', 'ы', 'ь']
};
const DICTIONARIES_UPPER = {};
for (const lang of Object.keys(DICTIONARIES)) {
  DICTIONARIES_UPPER[lang] = DICTIONARIES[lang].map(
    chars => {
      if(!chars) {
        return chars;
      }
      return chars[0].toUpperCase() + chars.slice(1)
    }
  );
}
module.exports.DICTIONARIES = DICTIONARIES;
module.exports.DICTIONARIES_UPPER = DICTIONARIES_UPPER;

const DICTIONARIES_REVERSE = {
  'en': [
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'a', 's', 'd', 'f', 
    'g', 'h', 'j', 'k', 'l', ';', "'", 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.',
    '`', '"', '<', '>', '~', '{', '}', ':'
  ],
  'ru': [
    'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'ф', 'ы', 'в', 'а', 
    'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю',
    'ё', 'э', 'б', 'ю', 'ё', 'х', 'ъ', 'ж'
  ]
};

module.exports.DICTIONARIES_REVERSE = DICTIONARIES_REVERSE;