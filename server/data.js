import * as Constants from 'constants';

const GENDER_MALE = 'M';
const GENDER_FEMALE = 'F';

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
  'Московский государственный университет им. М.В. Ломоносова',
  'Новосибирский государственный университет',
]
function generateTestUser(i) {
  const game = {};
  Object.keys(fields).forEach((key) => {
    game[key] = `${fields[key]} ${i}`;
  });
  return game;
}

module.exports = function* generateTestData(count = 50) {
  let i = 0;
  while (i < count) {
    yield generateTestGame(i);
    i += 1;
  }
};
