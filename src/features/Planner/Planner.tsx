import React from 'react';
import type { Dayjs } from 'dayjs';
import {
  Avatar,
  Badge,
  Calendar,
  Select,
  Space,
  theme,
} from 'antd';
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import type {
  BadgeProps,
  CalendarProps,
} from 'antd';
import {
  useGetActualRegistrationListQuery,
  useGetMasterListQuery,
  useGetPhotoListQuery,
  useGetPhotoQuery,
} from '../api/apiSlise';
import { Master } from '../../types';
import MastersSelect from '../../components/MastersSelect';
import { setCurrentMaster } from './plannerSlice';

interface Props {}
export default function Planner({}: Props) {
  const {
    data: regList,
    isLoading,
    isError,
  } = useGetActualRegistrationListQuery();

  const { date, currentMaster } = useAppSelector(
    (state) => state.plannerState
  );
  const dispatch = useAppDispatch();

  const currentMasterRegList = regList?.filter(
    (reg) => reg.masterId === currentMaster
  );

  const onPanelChange = (
    value: Dayjs,
    mode: CalendarMode
  ) => {
    // console.log(value.format('DD.MM.YYYY'), mode);
    // console.log(new Date().toLocaleDateString());
  };
  function onSelect(value: Dayjs) {
    // setDate(value.format('DD.MM.YYYY'));
  }

  // const onSelect = (value: Dayjs) => console.log(value.format('YYYY-MM-DD'));

  // const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
  //   if (info.type === 'date') return dateCellRender(current);
  //   if (info.type === 'month') return monthCellRender(current);
  //   return info.originNode;
  // };
  // };

  const handleMasterChange = (value: string) => {
    dispatch(setCurrentMaster(value));
  };

  return (
    <div className='planner'>
      <Calendar
        style={{ maxWidth: 400 }}
        dateCellRender={(date: Dayjs) => {
          if (
            currentMasterRegList?.some(
              (reg) =>
                reg.date
                  .toDate()
                  .toLocaleDateString() ===
                date.format('DD.MM.YYYY')
            )
          ) {
            const regCount =
              currentMasterRegList.filter(
                (reg) =>
                  reg.date
                    .toDate()
                    .toLocaleDateString() ===
                  date.format('DD.MM.YYYY')
              ).length;

            return (
              <div className='planner__calendar-cell planner__calendar-cell_type_event'>
                <div className='planner__badge'>
                  {regCount}
                </div>
              </div>
            );
          }
        }}
        fullscreen={false}
        onSelect={onSelect}
        onPanelChange={onPanelChange}
      />

      <MastersSelect
        isAllOption={false}
        currentMaster={currentMaster}
        onChange={handleMasterChange}
      />
    </div>
  );
}
