const DATE_FORMAT = 'DD.MM.YYYY';

const TIME_LIST = ['11:00'];
for (let i = 0; i < 20; i++) {
  const time =
    i % 2
      ? parseInt(TIME_LIST[i]) + 1 + ':00'
      : TIME_LIST[i].slice(0, 3) + '30';

  TIME_LIST.push(time);
}

export { DATE_FORMAT, TIME_LIST };
