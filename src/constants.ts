const DATE_FORMAT = 'DD.MM.YYYY';

const MONTHS = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];

const TIME_FORMAT = 'HH:mm';

const TIME_LIST = ['09:00'];
for (let i = 0; i < 30; i++) {
  const time =
    i === 29
      ? '00:00'
      : i % 2
      ? parseInt(TIME_LIST[i]) + 1 + ':00'
      : TIME_LIST[i].slice(0, 3) + '30';

  TIME_LIST.push(time);
}

const HAIR_LENGTH_LIST = [
  'короткие',
  'средние',
  'длинные',
];

const MAILE_HAIRCAT_LIST = [
  '1 насадка',
  '2 насадки',
  'модельная',
];

export {
  DATE_FORMAT,
  MONTHS,
  TIME_FORMAT,
  TIME_LIST,
  HAIR_LENGTH_LIST,
  MAILE_HAIRCAT_LIST,
};
