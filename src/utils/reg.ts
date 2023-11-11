import { type } from 'os';
import { TIME_LIST } from '../constants';
import {
  Category,
  DbRegistration,
  Income,
  Master,
  Service,
} from '../types';
import { getDataById } from './data';
import {
  MutationActionCreatorResult,
  MutationDefinition,
  BaseQueryFn,
} from '@reduxjs/toolkit/query';

type MasterData = Master | null | undefined;

function calculateRegDurationAndIncome(
  serviceIdList: string[],
  serviceList: Service[] | undefined,
  index: number
) {
  let duration = 0;
  let income = 0;

  serviceIdList.forEach((id) => {
    const service = serviceList?.find(
      (service) => service.id === id
    );

    if (service) {
      const currentServicePrice =
        +service.price.split('/')[index];
      const serviceIncome = service.priceDivider
        ? currentServicePrice /
          service.priceDivider
        : currentServicePrice;
      duration +=
        service.duration[index] ||
        service.duration[0];
      income += serviceIncome;
    }
  });
  return { duration, income };
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
  gender: 'male' | 'female' | null | undefined
) {
  return gender
    ? serviceList?.filter((service) =>
        gender === 'female'
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

function changeIncome(
  serviceIdList: string[],
  serviceList: Service[] | undefined,
  date: Date,
  index: number,
  operation: 'plus' | 'minus',
  updateIncome: (
    arg: Omit<Income, 'id'>
  ) => MutationActionCreatorResult<
    MutationDefinition<
      Omit<Income, 'id'>,
      BaseQueryFn,
      | 'Master'
      | 'User'
      | 'Category'
      | 'SubCategory'
      | 'Photo'
      | 'Service'
      | 'Registration'
      | 'Income',
      void,
      'api'
    >
  >
) {
  const incomeBodyList: Omit<Income, 'id'>[] = [];

  return Promise.allSettled(
    serviceIdList.map((serviceId, i) => {
      const service = getDataById(
        serviceList,
        serviceId
      );
      const currentServicePrice = service
        ? +service.price.split('/')[index || 0]
        : 0;
      const sum = service?.priceDivider
        ? currentServicePrice /
          service.priceDivider
        : currentServicePrice;
      incomeBodyList.push({
        serviceId,
        categoryId: service?.categoryId || '',
        date,
        sum: operation === 'plus' ? sum : -sum,
      });
      return updateIncome(incomeBodyList[i]);
    })
  ).then((results) => {
    results.forEach((result, i) => {
      console.log(result.status);

      if (result.status === 'rejected') {
        updateIncome(incomeBodyList[i]);
      }
    });
  });
}

function getServiceIdListsForUpdating(
  oldServiceIdList: string[] | undefined,
  newServiceIdList: string[]
) {
  const addedServiceIdList: string[] = [];
  const deletedServiceIdList: string[] = [];

  oldServiceIdList?.forEach((serviceId) => {
    if (!newServiceIdList.includes(serviceId)) {
      deletedServiceIdList.push(serviceId);
    }
  });

  newServiceIdList.forEach((serviceId) => {
    if (!oldServiceIdList?.includes(serviceId)) {
      addedServiceIdList.push(serviceId);
    }
  });

  return {
    addedServiceIdList,
    deletedServiceIdList,
  };
}

export {
  calculateRegDurationAndIncome,
  calculateRegTimeList,
  filterServicesByMaster,
  filterServicesByGender,
  hasMasterHairCategory,
  isIndexSelect,
  isMastersCategoriesSame,
  changeIncome,
  getServiceIdListsForUpdating,
};
