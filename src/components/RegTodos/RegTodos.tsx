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
import { setRegFormValues } from '../../reducers/regSlice';
import {
  convertDateStrToDate,
  convertDbDateToStr,
} from '../../utils/date';
import {
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

interface RegTodosProps {
  isTimeSelectAvailable: boolean;
  setIsTimeSelectAvailable: (
    value: boolean
  ) => void;
}

export default function RegTodos({
  isTimeSelectAvailable,
  setIsTimeSelectAvailable,
}: RegTodosProps) {
  const { data: userList } =
    useGetUserListQuery();
  const { data: serviceList } =
    useGetServiceListQuery();

  const {
    regCardInfo,
    regCardUser,
    draggableRegCard,
  } = useAppSelector(
    (state) => state.regCardState
  );
  const {
    masterRegList,
    regFormValues,
    isRegFormActive,
  } = useAppSelector((state) => state.regState);
  const { currentMaster, prevMaster } =
    useAppSelector((state) => state.mastersState);
  const { date } = useAppSelector(
    (state) => state.calendarState
  );

  const [updateReg, { isError, isLoading }] =
    useUpdateRegistrationMutation();
  const [updateIncome] =
    useUpdateIncomeMutation();

  const dispatch = useAppDispatch();

  const [selectedTime, setSelectedTime] =
    useState('');

  const regList = masterRegList
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
          toggleTimeSelect={
            setIsTimeSelectAvailable
          }
          key={reg.id}
        />
      );
    });

  function handleTimeCellClick(time: string) {
    if (isTimeSelectAvailable) {
      selectedTime && time === selectedTime
        ? setSelectedTime('')
        : setSelectedTime(time);
      if (isRegFormActive) {
        if (time === regFormValues.time) {
          dispatch(
            setRegFormValues({
              ...regFormValues,
              time: undefined,
            })
          );
        } else {
          dispatch(
            setRegFormValues({
              ...regFormValues,
              time,
            })
          );
        }
      } else if (regCardInfo) {
        updateReg({
          id: regCardInfo.id,
          body: {
            time,
            date: convertDateStrToDate(date),
            masterId: currentMaster?.id,
          },
        });
      }
    }

    setIsTimeSelectAvailable(false);
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
        regCardInfo.serviceIdList,
        serviceList,
        regCardInfo.date.toDate(),
        regCardInfo.serviceIndex,
        'minus',
        updateIncome
      ).then(() => {
        changeIncome(
          regCardInfo.serviceIdList,
          serviceList,
          convertDateStrToDate(date),
          regCardInfo.serviceIndex,
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
    if (!isRegFormActive) {
      setSelectedTime('');
    }
  }, [isRegFormActive]);

  return (
    <div className='reg-todos'>
      {regCardInfo &&
        regCardUser &&
        draggableRegCard && (
          <RegCard
            reg={regCardInfo}
            user={regCardUser}
            toggleTimeSelect={
              setIsTimeSelectAvailable
            }
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
      <div>{regList}</div>
    </div>
  );
}
