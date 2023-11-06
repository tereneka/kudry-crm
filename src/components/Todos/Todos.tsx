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
  setIsRegCardCopyVisible,
  setRegCardInfo,
  setRegCardUser,
} from '../../reducers/regCardSlice';

export default function Todos() {
  const { data: users } = useGetUserListQuery();

  const { date } = useAppSelector(
    (state) => state.calendarState
  );
  const {
    masterRegList,
    regFormValues,
    isTimeError,
  } = useAppSelector((state) => state.regState);
  const { regCardInfo } = useAppSelector(
    (state) => state.regCardState
  );

  const [updateReg, { isError }] =
    useUpdateRegistrationMutation();

  const dispatch = useAppDispatch();

  const [
    isTimeSelectAvailable,
    setIsTimeSelectAvailable,
  ] = useState(false);

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

    if (isTimeSelectAvailable && time) {
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
    }

    setIsTimeSelectAvailable(false);
  }

  function handleTimeCellDrop(timeIndex: number) {
    if (regCardInfo) {
      updateReg({
        id: regCardInfo.id,
        body: {
          time: TIME_LIST[timeIndex],
          date: convertDateStrToDate(date),
        },
      });
      dispatch(setRegCardInfo(null));
      dispatch(setRegCardUser(null));
      dispatch(setIsRegCardCopyVisible(false));
    }
  }

  useEffect(() => {
    if (isError) {
      showErrMessage();
      dispatch(setRegCardInfo(null));
      dispatch(setRegCardUser(null));
      dispatch(setIsRegCardCopyVisible(false));
      dispatch(setDraggableRegCard(null));
    }
  }, [isError]);

  return (
    <div className='todos'>
      <Tooltip
        title={
          isTimeError
            ? 'необходимо выбрать время'
            : 'выбрать время'
        }
        open={isTimeError || undefined}
        color={
          isTimeError ? 'rgba(215, 142, 123)' : ''
        }>
        <Button
          icon={<SelectOutlined />}
          type='primary'
          danger={!isTimeSelectAvailable}
          size='small'
          onClick={toggleTimeSelectBtn}
        />
      </Tooltip>

      {TIME_LIST.map((time, index) => (
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
                regFormValues.time === time
              )
            }
            onClick={handleTimeCellClick}
            data-time={time}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() =>
              handleTimeCellDrop(index)
            }
          />
          {/* <div className='todos__time-table-cell' /> */}
        </div>
      ))}
      {regList}
      {errorMessage}
    </div>
  );
}
