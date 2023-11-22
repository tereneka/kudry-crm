import './Todos.css';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { Button, Tooltip } from 'antd';
import { SelectOutlined } from '@ant-design/icons';
import { TIME_LIST } from '../../constants';
import { useEffect, useState } from 'react';
import {
  useGetServiceListQuery,
  useGetUserListQuery,
  useUpdateIncomeMutation,
  useUpdateRegistrationMutation,
} from '../../reducers/apiSlice';
import { setRegFormValues } from '../../reducers/regSlice';
import { classByCondition } from '../../utils/className';
import RegCard from '../RegCard/RegCard';
import {
  convertDateStrToDate,
  convertDbDateToStr,
} from '../../utils/date';
import {
  setDraggableRegCard,
  setRegCardInfo,
  setRegCardUser,
} from '../../reducers/regCardSlice';
import {
  changeIncome,
  isMastersCategoriesSame,
} from '../../utils/reg';
import { setIsError } from '../../reducers/appSlice';

export default function Todos() {
  const { data: users } = useGetUserListQuery();
  const { data: serviceList } =
    useGetServiceListQuery();

  const { date } = useAppSelector(
    (state) => state.calendarState
  );
  const {
    masterRegList,
    regFormValues,
    isRegFormActive,
  } = useAppSelector((state) => state.regState);
  const {
    regCardInfo,
    regCardUser,
    draggableRegCard,
  } = useAppSelector(
    (state) => state.regCardState
  );
  const { currentMaster, prevMaster } =
    useAppSelector((state) => state.mastersState);

  const [
    updateReg,
    { isError, isLoading, error },
  ] = useUpdateRegistrationMutation();
  const [updateIncome] =
    useUpdateIncomeMutation();

  const dispatch = useAppDispatch();

  const [
    isTimeSelectAvailable,
    setIsTimeSelectAvailable,
  ] = useState(false);
  const [selectedTime, setSelectedTime] =
    useState('');
  const [updateBody, setUpdateBody] =
    useState<any>({});

  const regList = masterRegList
    ?.filter(
      (reg) =>
        convertDbDateToStr(reg.date) === date
    )
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((reg) => {
      const user = users?.find(
        (user) => user.id === reg.userId
      );

      return (
        <RegCard
          reg={reg}
          user={user}
          toggleTimeSelect={
            setIsTimeSelectAvailable
          }
          key={reg.id}
        />
      );
    });

  function toggleTimeSelectBtn() {
    setIsTimeSelectAvailable(
      !isTimeSelectAvailable
    );
  }

  function handleTimeCellClick(time: string) {
    // const time = e.currentTarget.dataset.time;
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
        setUpdateBody({
          time,
          date: convertDateStrToDate(date),
          masterId: currentMaster?.id,
        });
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

  useEffect(() => {
    dispatch(setIsError(isError));
    if (isError) {
      dispatch(setDraggableRegCard(null));
    }
    setSelectedTime('');
  }, [isError]);

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
  const e = error as any;
  return (
    <div className='todos'>
      {isError && (
        <div>
          {JSON.stringify(updateBody) +
            ' ' +
            e.message +
            ' ' +
            date +
            JSON.stringify(
              convertDateStrToDate(date)
            )}
        </div>
      )}
      <Tooltip title='выбрать время'>
        <Button
          icon={
            <SelectOutlined rev={undefined} />
          }
          type='primary'
          danger={!isTimeSelectAvailable}
          size='small'
          onClick={toggleTimeSelectBtn}
        />
      </Tooltip>
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
          className='todos__time-table-row'
          key={time}>
          <div className='todos__time-table-cell'>
            {time}
          </div>
          <div
            className={
              classByCondition(
                'todos__time-table-cell',
                isTimeSelectAvailable,
                'active'
              ) +
              ' ' +
              classByCondition(
                'todos__time-table-cell',
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
