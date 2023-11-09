import './Todos.css';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { Button, Tooltip, message } from 'antd';
import { SelectOutlined } from '@ant-design/icons';
import { TIME_LIST } from '../../constants';
import { useEffect, useState } from 'react';
import {
  useGetUserListQuery,
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
import { isMastersCategoriesSame } from '../../utils/reg';

export default function Todos() {
  const { data: users } = useGetUserListQuery();

  const { date } = useAppSelector(
    (state) => state.calendarState
  );
  const {
    masterRegList,
    regFormValues,
    isRegFormActive,
  } = useAppSelector((state) => state.regState);
  const { regCardInfo, regCardUser } =
    useAppSelector((state) => state.regCardState);
  const { currentMaster, prevMaster } =
    useAppSelector((state) => state.mastersState);

  const [updateReg, { isError }] =
    useUpdateRegistrationMutation();

  const dispatch = useAppDispatch();

  const [
    isTimeSelectAvailable,
    setIsTimeSelectAvailable,
  ] = useState(false);
  const [selectedTime, setSelectedTime] =
    useState('');

  const regList = masterRegList
    ?.filter(
      (reg) =>
        convertDbDateToStr(reg.date) === date
    )
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

  const [messageApi, errorMessage] =
    message.useMessage();

  function showErrMessage() {
    messageApi.open({
      type: 'error',
      content: 'Произошла ошибка :(',
      duration: 4,
    });
  }

  function toggleTimeSelectBtn() {
    setIsTimeSelectAvailable(
      !isTimeSelectAvailable
    );
  }

  function handleTimeCellClick(
    e: React.MouseEvent<
      HTMLDivElement,
      MouseEvent
    >
  ) {
    const time = e.currentTarget.dataset.time;

    setSelectedTime(time || '');

    if (isTimeSelectAvailable && time) {
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
        dispatch(setRegCardInfo(null));
        dispatch(setRegCardUser(null));
        setSelectedTime('');
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
    if (isError) {
      showErrMessage();
      dispatch(setDraggableRegCard(null));
    }
  }, [isError]);

  useEffect(() => {
    if (!isRegFormActive) {
      setSelectedTime('');
    }
  }, [isRegFormActive]);

  return (
    <div className='todos'>
      <Tooltip title='выбрать время'>
        <Button
          icon={<SelectOutlined />}
          type='primary'
          danger={!isTimeSelectAvailable}
          size='small'
          onClick={toggleTimeSelectBtn}
        />
      </Tooltip>
      {regCardInfo && regCardUser && (
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
                'active',
                isTimeSelectAvailable
              ) +
              ' ' +
              classByCondition(
                'todos__time-table-cell',
                'selected',
                selectedTime === time
              )
            }
            onClick={handleTimeCellClick}
            data-time={time}
          />
        </div>
      ))}
      <div>{regList}</div>

      {errorMessage}
    </div>
  );
}
