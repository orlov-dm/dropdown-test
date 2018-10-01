const Constants = require('./constants');
const User = require('./User');
const Avatars = require('@dicebear/avatars').default;
const MaleSprites = require('@dicebear/avatars-male-sprites').default;
const FemaleSprites = require('@dicebear/avatars-female-sprites').default;
const svgson = require('svgson-next').default;



const GENDER_MALE = 0;
const GENDER_FEMALE = 1;

const avatars = {
  [GENDER_MALE]: (new Avatars(MaleSprites)),
  [GENDER_FEMALE]: (new Avatars(FemaleSprites))
};

const dictionaries = {};

dictionaries[Constants.USER_FIELD_NAME] = {
  [GENDER_MALE]: [
    'Иван', 'Пётр', 'Александр',
    'Анатолий', 'Алексей', 'Максим',
    'Григорий', 'Ярослав',
  ],
  [GENDER_FEMALE]: [
    'Алина', 'Анастасия', 'Евгения',
    'Дарья', 'Мария', 'Маргарита',
    'Александра', 'Екатерина',
  ],
};

dictionaries[Constants.USER_FIELD_SURNAME] = [
  'Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев',
  'Петров', 'Соколов', 'Михайлов', 'Новиков', 'Фёдоров',
  'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семёнов',
  'Егоров', 'Павлов', 'Козлов', 'Степанов', 'Николаев',
  'Орлов', 'Андреев', 'Макаров', 'Никитин', 'Захаров',
];

dictionaries[Constants.USER_FIELD_WORKPLACE] = [
  // Universities
  'Московский государственный университет им. М.В. Ломоносова',
  'Новосибирский государственный университет',
  'Томский государственный университет',
  'Санкт-Петербургский государственный университет',
  'Московский физико-технический институт (государственный университет)',
  'Московский государственный технический университет имени Н.Э. Баумана',
  'Национальный исследовательский ядерный университет «МИФИ»',
  'Национальный исследовательский институт «Высшая школа экономики»',
  'Московский государственный институт международных отношений',
  'Томский политехнический университет',
  // Companies  
  'Газпром',
  'НК «ЛУКойл»',
  'НК «Роснефть»',
  'Сбербанк России',
  'РЖД',
  'Группа ВТБ',
  'Сургутнефтегаз',
  'Магнит',
  'АК «Транснефть»',
  'X5 Retail Group',
];

// from min to max inclusive
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getAvatar(id, gender) {
  // create svg and encode to json str
  const avatar = await svgson(avatars[gender].create(id));
  //console.log(avatar);
  return avatar;
}

async function generateTestUser(i) {
  const gender = getRandomInt(0, 1);
  const avatar = await getAvatar(i, gender);
  const userValues = {
    [Constants.USER_FIELD_ID]: i,
    [Constants.USER_FIELD_GENDER]: gender,
    [Constants.USER_FIELD_AVATAR_URL]: avatar
  };
  for (const field of Constants.USER_FIELDS) {
    if (field === Constants.USER_FIELD_ID ||
      field === Constants.USER_FIELD_GENDER ||
      field === Constants.USER_FIELD_AVATAR_URL) {
      continue;
    }
    let value = null;
    if (dictionaries.hasOwnProperty(field)) {
      const dictionary = field === Constants.USER_FIELD_NAME ?
        dictionaries[field][gender] : dictionaries[field];
      const valueIndex = getRandomInt(0, dictionary.length - 1);
      value = dictionary[valueIndex];
      if (field === Constants.USER_FIELD_SURNAME &&
        gender === GENDER_FEMALE) {
        value += 'а'; // Add female ending;
      }
    } else {
      if (field === Constants.USER_FIELD_USER_URL) {
        value = `id${i}`;
      }
    }
    userValues[field] = value;
  }

  return new User(userValues);
}

async function generateTestData(startIndex = 0, count = 10000) {
  const data = [];
  let i = startIndex;
  while (i < count) {
    const user = await generateTestUser(++i);
    data.push(user);
  }
  return data;
};

module.exports = generateTestData();
