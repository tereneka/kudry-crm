import React from 'react';
import './PlannerCalendar.css';
import { Calendar, Tooltip } from 'antd';
import { DATE_FORMAT } from '../../constants';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { setDate } from '../../reducers/calendarSlice';
import { setIsRegCardCopyVisible } from '../../reducers/regCardSlice';
import { classByCondition } from '../../utils/className';

export default function PlannerCalendar() {
  const { date } = useAppSelector(
    (state) => state.calendarState
  );

  const { masterRegList, isDateError } =
    useAppSelector((state) => state.regState);

  const dispatch = useAppDispatch();

  const dateCellRender = (date: Dayjs) => {
    const isRegs = masterRegList?.some(
      (reg) =>
        reg.date.toDate().toLocaleDateString() ===
        date.format(DATE_FORMAT)
    );
    const regCount = masterRegList?.filter(
      (reg) =>
        reg.date.toDate().toLocaleDateString() ===
        date.format(DATE_FORMAT)
    ).length;

    return (
      <div
        className={classByCondition(
          'planner__calendar-cell',
          'type_event',
          !!isRegs
        )}
        data-date={date.format(DATE_FORMAT)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDateDrop}>
        {isRegs && (
          <div className='planner__badge'>
            {regCount}
          </div>
        )}
      </div>
    );
  };

  function handleDateSelect(value: Dayjs) {
    dispatch(setDate(value.format(DATE_FORMAT)));
  }

  function handleDateDrop(
    e: React.DragEvent<HTMLDivElement>
  ) {
    dispatch(
      setDate(
        e.currentTarget.dataset.date as string
      )
    );
    dispatch(setIsRegCardCopyVisible(true));
  }

  return (
    <div className='planner-calendar'>
      <Calendar
        dateCellRender={dateCellRender}
        fullscreen={false}
        onSelect={handleDateSelect}
        value={dayjs(date, DATE_FORMAT)}
      />
      {/* <Tooltip
        title='некорректная дата для новой записи'
        open={isDateError}
        color='rgba(215, 142, 123)'
        placement='rightTop'>
        <Calendar
          dateCellRender={dateCellRender}
          fullscreen={false}
          onSelect={handleDateSelect}
          value={dayjs(date, DATE_FORMAT)}
        />
      </Tooltip> */}

      <ul className='planner-calendar__description-list'>
        <li className='planner-caledar__description-list-item'>
          записи
        </li>
        <li className='planner-caledar__description-list-item'>
          напоминалки
        </li>
      </ul>
    </div>
  );
}
