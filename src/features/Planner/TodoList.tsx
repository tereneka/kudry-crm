import React, {
  useEffect,
  useState,
} from 'react';
import { useAppSelector } from '../../store';
import { nanoid } from 'nanoid';
import {
  Registration,
  Service,
} from '../../types';
import { useGetServiceListQuery } from '../api/apiSlise';
import phone from '../../images/phone.svg';
import person from '../../images/person.svg';
import list from '../../images/list.svg';
import { Tooltip } from 'antd';

export default function TodoList() {
  const timeList = ['11:00'];
  for (let i = 0; i < 20; i++) {
    const time =
      i % 2
        ? parseInt(timeList[i]) + 1 + ':00'
        : timeList[i].slice(0, 3) + '30';

    timeList.push(time);
  }

  const { date, currentMasterRegList } =
    useAppSelector((state) => state.plannerState);

  const regList = currentMasterRegList
    ?.filter(
      (reg) =>
        reg.date.toDate().toLocaleDateString() ===
        date
    )
    .map((reg, index) => {
      return (
        <div
          className='todo-list__reg-card'
          style={{
            height:
              reg.time.length * 28 +
              (reg.time.length - 1) * 4,
            top:
              20 +
              timeList.indexOf(reg.time[0]) * 32,
          }}
          key={nanoid()}
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData(
              'index',
              index.toString()
            );
          }}>
          <div className='todo-list__reg-card-item'>
            <img src={person} alt='' />
            {reg.userName}
          </div>
          {/* <a
            className='todo-list__reg-card-link'
            href={`tel:${reg.phone}`}>
            <img src={phone} alt='' />
            {reg.phone}
          </a> */}
        </div>
      );
    });

  return (
    <div className='todo-list'>
      {timeList.map((time) => (
        <div
          className='todo-list__time-table'
          key={time}>
          <div className='todo-list__time-table-cell'>
            {time}
          </div>
          <Tooltip title='добавить запись'>
            <div className='todo-list__time-table-cell' />
          </Tooltip>
          <Tooltip title='добавить напоминание'>
            <div className='todo-list__time-table-cell' />
          </Tooltip>
        </div>
      ))}
      {regList}
    </div>
  );
}
