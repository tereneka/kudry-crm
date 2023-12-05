function getDateRangeList(dateRange: {
  startDate: Date;
  endDate: Date;
}) {
  function getDate(n: number, initDate: Date) {
    return new Date(
      initDate.getFullYear(),
      initDate.getMonth() + n
    );
  }

  let result = [];
  let num = 0;
  let date = getDate(0, dateRange.startDate);
  const endDate = getDate(0, dateRange.endDate);
  while (date < endDate) {
    date = getDate(num, dateRange.startDate);
    result.push(date);
    num += 1;
  }

  return result;
}

// const categoryColorList: {
//   [key: string]: string;
// } = {
//   'парикмахерские услуги': 'rgb(137, 175, 176)',
//   маникюр: 'rgba(215, 142, 123)',
//   педикюр: 'rgb(20, 100, 120)',
//   'брови и ресницы': 'rgb(220, 100, 70)',
//   макияж: 'rgb(170, 160, 30)',
// };
const colorList = [
  'rgb(137, 175, 176)',
  'rgba(215, 142, 123)',
  'rgb(20, 100, 120)',
  'rgb(220, 100, 70)',
  'rgb(170, 160, 30)',
  'rgb(137, 175, 176)',
  'rgba(215, 142, 123)',
  'rgb(20, 100, 120)',
  'rgb(220, 100, 70)',
  'rgb(170, 160, 30)',
];

export { getDateRangeList, colorList };
