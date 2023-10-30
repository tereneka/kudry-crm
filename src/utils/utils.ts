import { TIME_LIST } from '../constants';
import { Service } from '../types';

function calculateServicesDuration(
  serviceIdList: string[],
  serviceList: Service[] | undefined,
  index: number
) {
  let result = 0;

  serviceIdList.forEach((id) => {
    const service = serviceList?.find(
      (service) => service.id === id
    );

    if (service) {
      result +=
        service.duration[index] ||
        service.duration[0];
    }
  });
  return result;
}

function calculateRegTimeList(
  startTime: string | undefined,
  duration: number
) {
  const result = [];

  if (startTime) {
    const startIndex =
      TIME_LIST.indexOf(startTime);

    for (let i = 0; i < duration; i++) {
      result.push(TIME_LIST[startIndex + i]);
    }
  }

  return result.length > 0 ? result : undefined;
}

function convertDateStringToDate(
  dateStr: string
) {
  return new Date(
    dateStr.split('.').reverse().join('.')
  );
}

export {
  calculateServicesDuration,
  calculateRegTimeList,
  convertDateStringToDate,
};
