import { type } from 'os';
import { TIME_LIST } from '../constants';
import {
  Category,
  Master,
  Service,
} from '../types';
import { getDataById } from './data';

type MasterData = Master | null | undefined;

function calculateRegDuration(
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

function filterServicesByMaster(
  serviceList: Service[] | undefined,
  master: MasterData
) {
  return serviceList?.filter((service) =>
    master?.categoryIdList.some(
      (id) => id === service.categoryId
    )
  );
}

function isHairCategory(
  master: MasterData,
  categoryList: Category[] | undefined
) {
  return master?.categoryIdList.some(
    (categoryId) =>
      getDataById(categoryList, categoryId)
        ?.name === 'парикмахерские услуги'
  );
}

function isHairLengthSelect(
  selectedServiceList: string[],
  serviceList: Service[] | undefined
) {
  return selectedServiceList.some((serviceID) =>
    serviceList?.find(
      (service) =>
        service.id === serviceID &&
        service.duration.length > 1
    )
  );
}

function isMastersCategoriesSame(
  prevMaster: MasterData,
  currentMaster: MasterData
) {
  let result = true;
  prevMaster?.categoryIdList.forEach(
    (categoryId) => {
      if (
        !currentMaster?.categoryIdList.includes(
          categoryId
        )
      ) {
        result = false;
      }
    }
  );

  return result;
}

export {
  calculateRegDuration,
  calculateRegTimeList,
  filterServicesByMaster,
  isHairCategory,
  isHairLengthSelect,
  isMastersCategoriesSame,
};
