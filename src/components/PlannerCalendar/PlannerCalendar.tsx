import React from 'react';
import './PlannerCalendar.css';
import { Calendar } from 'antd';
import { DATE_FORMAT } from '../../constants';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { setDate } from '../../reducers/calendarSlice';
import { classByCondition } from '../../utils/className';
import { useGetRegistrationListQuery } from '../../reducers/apiSlice';

export default function PlannerCalendar() {
  const { date } = useAppSelector(
    (state) => state.calendarState
  );
  const { masterRegList } = useAppSelector(
    (state) => state.regState
  );
  const { masterNoteList } = useAppSelector(
    (state) => state.notesState
  );

  const { data: regList } =
    useGetRegistrationListQuery();

  const dispatch = useAppDispatch();

  const dateCellRender = (date: Dayjs) => {
    const isRegs = regList?.some(
      (reg) =>
        reg.date.toDate().toLocaleDateString() ===
        date.format(DATE_FORMAT)
    );
    const isMasterRegs = masterRegList?.some(
      (reg) =>
        reg.date.toDate().toLocaleDateString() ===
        date.format(DATE_FORMAT)
    );
    const isNotes = masterNoteList?.some(
      (note) =>
        note.date
          .toDate()
          .toLocaleDateString() ===
        date.format(DATE_FORMAT)
    );
    const regCount = regList?.filter(
      (reg) =>
        reg.date.toDate().toLocaleDateString() ===
        date.format(DATE_FORMAT)
    ).length;
    const masterRegCount = masterRegList?.filter(
      (reg) =>
        reg.date.toDate().toLocaleDateString() ===
        date.format(DATE_FORMAT)
    ).length;
    const notesCount = masterNoteList?.filter(
      (note) =>
        note.date
          .toDate()
          .toLocaleDateString() ===
        date.format(DATE_FORMAT)
    ).length;

    return (
      <div
        className={classByCondition(
          'planner-calendar__cell',
          !!(isRegs || isNotes),
          'type_event'
        )}
        data-date={date.format(DATE_FORMAT)}>
        {isMasterRegs && (
          <div className='planner-calendar__badge planner-calendar__badge_type_master-reg'>
            {masterRegCount}
          </div>
        )}
        {isRegs && (
          <div className='planner-calendar__badge planner-calendar__badge_type_reg'>
            {regCount}
          </div>
        )}
        {isNotes && (
          <div className='planner-calendar__badge planner-calendar__badge_type_note'>
            {notesCount}
          </div>
        )}
      </div>
    );
  };

  function handleDateSelect(value: Dayjs) {
    dispatch(setDate(value.format(DATE_FORMAT)));
  }

  return (
    <div className='planner-calendar'>
      <Calendar
        cellRender={dateCellRender}
        fullscreen={false}
        onSelect={handleDateSelect}
        value={dayjs(date, DATE_FORMAT)}
      />
      <ul className='planner-calendar__description-list'>
        <li className='planner-caledar__description-list-item'>
          записи мастера
        </li>
        <li className='planner-caledar__description-list-item'>
          всего записей
        </li>
        <li className='planner-caledar__description-list-item'>
          напоминалки мастера
        </li>
      </ul>
    </div>
  );
}
