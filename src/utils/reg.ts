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
  let duration = 0;

  serviceIdList.forEach((id) => {
    const service = serviceList?.find(
      (service) => service.id === id
    );

    if (service) {
      duration +=
        service.duration[index] ||
        service.duration[0];
    }
  });
  return duration;
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

function filterServicesByGender(
  serviceList: Service[] | undefined,
  gender: 'женский' | 'мужской' | undefined
) {
  return gender
    ? serviceList?.filter((service) =>
        gender === 'женский'
          ? service.isFemale ||
            service.isFemale === undefined
          : service.isMale ||
            service.isMale === undefined
      )
    : serviceList;
}

function hasMasterHairCategory(
  master: MasterData,
  categoryList: Category[] | undefined
) {
  return master?.categoryIdList.some(
    (categoryId) =>
      getDataById(categoryList, categoryId)
        ?.name === 'парикмахерские услуги'
  );
}

function isIndexSelect(
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
  filterServicesByGender,
  hasMasterHairCategory,
  isIndexSelect,
  isMastersCategoriesSame,
};
