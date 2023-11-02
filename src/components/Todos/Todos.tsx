import './Todos.css';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { nanoid } from 'nanoid';
import person from '../../images/person.svg';
import phone from '../../images/phone.svg';
import { Button, Tooltip } from 'antd';
import { SelectOutlined } from '@ant-design/icons';
import { TIME_LIST } from '../../constants';
import { useState } from 'react';
import { useGetUserListQuery } from '../../reducers/apiSlice';
import { setRegFormValues } from '../../reducers/regSlice';
import { classByCondition } from '../../utils/className';
import RegCard from '../RegCard/RegCard';
import { convertDbDateToStr } from '../../utils/date';

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
    .map((reg, index) => {
      const user = users?.find(
        (user) => user.id === reg.userId
      );

      return <RegCard reg={reg} user={user} />;
    });

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
                regFormValues.time === time
              )
            }
            onClick={handleTimeCellClick}
            data-time={time}
          />
          {/* <div className='todos__time-table-cell' /> */}
        </div>
      ))}
      {regList}
    </div>
  );
}
