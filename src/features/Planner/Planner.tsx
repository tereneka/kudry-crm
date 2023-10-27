import type { Dayjs } from 'dayjs';
import { Button, Calendar, Tooltip } from 'antd';
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { useGetActualRegistrationListQuery } from '../api/apiSlise';
import MastersSelect from '../../components/MastersSelect';
import {
  setCurrentMaster,
  setCurrentMasterRegList,
  setDate,
  setIsRegFormOpen,
} from './plannerSlice';
import TodoList from './TodoList';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '../../constants';
import plus from '../../images/plus.svg';
import { PlusOutlined } from '@ant-design/icons';
import { type } from 'os';
import RegForm from './RegForm';

export default function Planner() {
  const {
    data: regList,
    isLoading,
    isError,
  } = useGetActualRegistrationListQuery();

  const {
    date,
    currentMaster,
    currentMasterRegList,
    isRegFormOpen,
  } = useAppSelector(
    (state) => state.plannerState
  );
  const dispatch = useAppDispatch();

  const dateCellRender = (date: Dayjs) => {
    if (
      currentMasterRegList?.some(
        (reg) =>
          reg.date
            .toDate()
            .toLocaleDateString() ===
          date.format(DATE_FORMAT)
      )
    ) {
      const regCount =
        currentMasterRegList.filter(
          (reg) =>
            reg.date
              .toDate()
              .toLocaleDateString() ===
            date.format(DATE_FORMAT)
        ).length;

      return (
        <div className='planner__calendar-cell planner__calendar-cell_type_event'>
          <div className='planner__badge'>
            {regCount}
          </div>
        </div>
      );
    }
  };

  function handleDateSelect(value: Dayjs) {
    dispatch(setDate(value.format(DATE_FORMAT)));
  }

  function handleMasterChange(value: string) {
    dispatch(setCurrentMaster(value));
    dispatch(
      setDate(new Date().toLocaleDateString())
    );
  }

  function handleAddRegBtnClick() {
    dispatch(setIsRegFormOpen(true));
  }

  useEffect(() => {
    dispatch(
      setCurrentMasterRegList(
        regList?.filter(
          (reg) => reg.masterId === currentMaster
        )
      )
    );
  }, [regList, currentMaster]);

  return (
    <div className='planner'>
      <div className='planner__add-btn-group'>
        <Tooltip title='добавить запись'>
          <Button
            shape='circle'
            icon={<PlusOutlined />}
            type='primary'
            danger
            size='large'
            onClick={handleAddRegBtnClick}
          />
        </Tooltip>

        <Tooltip title='добавить напоминание'>
          <Button
            shape='circle'
            icon={<PlusOutlined />}
            type='primary'
            size='large'
          />
        </Tooltip>
      </div>
      <div className='planner__calendar-container'>
        <Calendar
          style={{ maxWidth: 500 }}
          dateCellRender={dateCellRender}
          fullscreen={false}
          onSelect={handleDateSelect}
          value={dayjs(date, DATE_FORMAT)}
        />

        <div className='planner__description-container'>
          <MastersSelect
            isAllOption={false}
            currentMaster={currentMaster}
            onChange={handleMasterChange}
          />

          <ul className='planner__description-list'>
            <li className='planner__description-list-item'>
              записи
            </li>
            <li className='planner__description-list-item'>
              напоминалки
            </li>
          </ul>
        </div>
      </div>
      <TodoList />
      <RegForm />
    </div>
  );
}
