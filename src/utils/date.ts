function convertDateStrToDate(dateStr: string) {
  return new Date(
    dateStr.split('.').reverse().join('.')
  );
}

function getEarlierDate(daysNum: number) {
  return new Date(
    new Date().setDate(
      new Date().getDate() - daysNum
    )
  );
}

function isDateBeforeToday(date: Date) {
  return (
    date.setHours(0, 0, 0, 0) <
    new Date().setHours(0, 0, 0, 0)
  );
}

export {
  convertDateStrToDate,
  getEarlierDate,
  isDateBeforeToday,
};
