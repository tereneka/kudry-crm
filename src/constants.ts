const DATE_FORMAT = 'DD.MM.YYYY';

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

const INITIAL_NOTE_FORM_VALUES = {
  text: '',
  userId: null,
  masterId: '',
  date: new Date(),
  time: '',
};

export {
  DATE_FORMAT,
  TIME_LIST,
  HAIR_LENGTH_LIST,
  MAILE_HAIRCAT_LIST,
  INITIAL_NOTE_FORM_VALUES,
};
