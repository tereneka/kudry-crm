const DATE_FORMAT = 'DD.MM.YYYY';

const TIME_LIST = ['11:00'];
for (let i = 0; i < 20; i++) {
  const time =
    i % 2
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

const INITIAL_REG_FORM_VALUES = {
  userId: undefined,
  serviceIdList: undefined,
  masterId: undefined,
  date: new Date(),
  time: undefined,
  duration: 0,
  income: 0,
  serviceIndex: 0,
  gender: null,
};

export {
  DATE_FORMAT,
  TIME_LIST,
  HAIR_LENGTH_LIST,
  MAILE_HAIRCAT_LIST,
  INITIAL_REG_FORM_VALUES,
};
