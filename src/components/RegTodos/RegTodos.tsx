import React, {
  useEffect,
  useState,
} from 'react';
import './RegTodos.css';
import { TIME_LIST } from '../../constants';
import { classByCondition } from '../../utils/className';
import RegCard from '../RegCard/RegCard';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import {
  convertDateStrToDate,
  convertDbDateToStr,
} from '../../utils/date';
import {
  useGetMasterListQuery,
  useGetRegistrationListQuery,
  useGetServiceListQuery,
  useGetUserListQuery,
  useUpdateIncomeMutation,
  useUpdateRegistrationMutation,
} from '../../reducers/apiSlice';
import { setIsError } from '../../reducers/appSlice';
import {
  setRegCardInfo,
  setRegCardUser,
  setDraggableRegCard,
} from '../../reducers/regCardSlice';
import {
  isMastersCategoriesSame,
  changeIncome,
} from '../../utils/reg';
import { setRegFormTime } from '../../reducers/regSlice';
import { setIsTimeSelectAvailable } from '../../reducers/plannerSlice';
import RegMark from '../RegMark/RegMark';
import { Master } from '../../types';

export default function RegTodos() {
  const { data: userList } =
    useGetUserListQuery();
  const { data: serviceList } =
    useGetServiceListQuery();

  const { data: regList } =
    useGetRegistrationListQuery();
  const { data: masterList } =
    useGetMasterListQuery();
  const {
    regCardInfo,
    regCardUser,
    draggableRegCard,
  } = useAppSelector(
    (state) => state.regCardState
  );
  const { masterRegList, regFormTime } =
    useAppSelector((state) => state.regState);
  const { currentMaster, prevMaster } =
    useAppSelector((state) => state.mastersState);
  const { date } = useAppSelector(
    (state) => state.calendarState
  );
  const { isFormActive, isTimeSelectAvailable } =
    useAppSelector((state) => state.plannerState);

  const [updateReg, { isError, isLoading }] =
    useUpdateRegistrationMutation();
  const [updateIncome] =
    useUpdateIncomeMutation();

  const dispatch = useAppDispatch();

  const [selectedTime, setSelectedTime] =
    useState('');

  const currentMasterRegList = masterRegList
    ?.filter(
      (reg) =>
        convertDbDateToStr(reg.date) === date
    )
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((reg, index) => {
      const user = userList?.find(
        (user) => user.id === reg.userId
      );

      return (
        <RegCard
          reg={reg}
          user={user}
          index={index}
          key={reg.id}
        />
      );
    });

  let position = 0;
  const otherMastersRegList = regList
    ?.filter(
      (reg) =>
        reg.masterId !== currentMaster?.id &&
        convertDbDateToStr(reg.date) === date
    )
    .sort((a, b) =>
      a.masterId.localeCompare(b.masterId)
    )
    .map((reg, index, list) => {
      const master = masterList?.find(
        (master) => master.id === reg.masterId
      ) as Master;
      if (
        index > 0 &&
        reg.masterId !== list[index - 1]?.masterId
      ) {
        position += 1;
      }
      return (
        <RegMark
          reg={reg}
          master={master}
          position={position}
          key={reg.id}
        />
      );
    });

  function handleTimeCellClick(time: string) {
    if (isTimeSelectAvailable) {
      selectedTime && time === selectedTime
        ? setSelectedTime('')
        : setSelectedTime(time);

      if (regCardInfo) {
        updateReg({
          id: regCardInfo.id,
          body: {
            time,
            date: convertDateStrToDate(date),
            masterId: currentMaster?.id,
          },
        });
      } else if (time === regFormTime) {
        dispatch(setRegFormTime(''));
      } else {
        dispatch(setRegFormTime(time));
      }
    }

    dispatch(setIsTimeSelectAvailable(false));
  }

  // описываем действия при смене мастера во время переноса записи
  useEffect(() => {
    if (
      regCardInfo &&
      !isMastersCategoriesSame(
        prevMaster,
        currentMaster
      )
    ) {
      dispatch(setRegCardInfo(null));
      dispatch(setRegCardUser(null));
      dispatch(setDraggableRegCard(null));
    }
  }, [currentMaster]);

  // обработываем ошибку при переносе записи
  useEffect(() => {
    dispatch(setIsError(isError));
    if (isError) {
      dispatch(setDraggableRegCard(null));
    }
    setSelectedTime('');
  }, [isError]);

  // обнавляем доход после переноса записи
  useEffect(() => {
    if (
      !isLoading &&
      regCardInfo &&
      convertDbDateToStr(regCardInfo?.date) !==
        date
    ) {
      changeIncome(
        currentMaster,
        regCardInfo.serviceIdList,
        serviceList,
        regCardInfo.date.toDate(),
        regCardInfo.serviceIndex,
        regCardInfo.priceCorrection,
        'minus',
        updateIncome
      ).then(() => {
        changeIncome(
          currentMaster,
          regCardInfo.serviceIdList,
          serviceList,
          convertDateStrToDate(date),
          regCardInfo.serviceIndex,
          regCardInfo.priceCorrection,
          'plus',
          updateIncome
        ).then(() => {
          dispatch(setRegCardInfo(null));
          dispatch(setRegCardUser(null));
          setSelectedTime('');
        });
      });
    } else if (!isLoading) {
      dispatch(setRegCardInfo(null));
      dispatch(setRegCardUser(null));
      setSelectedTime('');
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isFormActive) {
      setSelectedTime('');
    }
  }, [isFormActive]);

  useEffect(() => {
    setSelectedTime('');
    dispatch(setRegFormTime(''));
  }, [date]);

  return (
    <div className='reg-todos'>
      {regCardInfo &&
        regCardUser &&
        draggableRegCard && (
          <RegCard
            reg={regCardInfo}
            user={regCardUser}
            type='copy'
          />
        )}

      {TIME_LIST.map((time) => (
        <div
          className='reg-todos__time-table-row'
          key={time}>
          <div className='reg-todos__time-table-cell'>
            {time}
          </div>
          <div
            className={
              classByCondition(
                'reg-todos__time-table-cell',
                isTimeSelectAvailable,
                'active'
              ) +
              ' ' +
              classByCondition(
                'reg-todos__time-table-cell',
                selectedTime === time,
                'selected'
              )
            }
            onClick={() =>
              handleTimeCellClick(time)
            }
            data-time={time}
          />
        </div>
      ))}
      <div>{currentMasterRegList}</div>
      {otherMastersRegList}
    </div>
  );
}
