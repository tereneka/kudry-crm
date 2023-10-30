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
        reg.date.toDate().toLocaleDateString() ===
        date
    )
    .map((reg, index) => {
      const user = users?.find(
        (user) => user.id === reg.userId
      );

      return (
        <div
          className='todos__reg-card'
          style={{
            height:
              reg.duration * 28 +
              (reg.duration - 1) * 4,
            top:
              44 +
              TIME_LIST.indexOf(reg.time) * 32,
          }}
          key={nanoid()}
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData(
              'index',
              index.toString()
            );
          }}>
          <div className='todos__reg-card-item'>
            <img src={person} alt='' />
            {user?.name}
          </div>
          <a
            className='todo-list__reg-card-link'
            href={`tel:${user?.phone}`}>
            <img src={phone} alt='' />
            {user?.phone}
          </a>
        </div>
      );
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
      dispatch(
        setRegFormValues({
          ...regFormValues,
          time,
        })
      );
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
          className='todos__time-table'
          key={time}>
          <div className='todos__time-table-cell'>
            {time}
          </div>
          <div
            className={`todos__time-table-cell ${
              isTimeSelectAvailable
                ? 'todos__time-table-cell_active'
                : ''
            } ${
              regFormValues.time === time
                ? 'todos__time-table-cell_selected'
                : ''
            }`}
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
