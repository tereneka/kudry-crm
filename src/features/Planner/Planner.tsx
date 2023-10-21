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

interface Props {}
export default function Planner({}: Props) {
  const {
    data: regList,
    isLoading,
    isError,
  } = useGetActualRegistrationListQuery();

  const { data: masterList } =
    useGetMasterListQuery();

  const { data: masterPhotoList } =
    useGetPhotoListQuery({
      folderPath: 'masters',
      numberPhotosPerPage: 4,
    });

  // const { data: masterPhotoUrl } =
  //   useGetPhotoQuery('masters/ulka.png');
  // console.log(masterPhotoUrl);

  const { isMobile } = useAppSelector(
    (state) => state.appState
  );

  const { date } = useAppSelector(
    (state) => state.regState
  );
  const dispatch = useAppDispatch();

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

  const { Option } = Select;

  const selectOptionContent = (
    master: Master
  ) => (
    <div>
      <Avatar
        style={{ background: '#10899e' }}
        src={master.photoUrl}
        alt='фото мастера'
      />{' '}
      {master.name}
    </div>
  );

  return (
    <>
      <Calendar
        className='reg-calendar'
        dateCellRender={(date: Dayjs) => {
          if (
            regList?.some(
              (reg) =>
                reg.date
                  .toDate()
                  .toLocaleDateString() ===
                date.format('DD.MM.YYYY')
            )
          ) {
            const regCount = regList.filter(
              (reg) =>
                reg.date
                  .toDate()
                  .toLocaleDateString() ===
                date.format('DD.MM.YYYY')
            ).length;

            return (
              <div className='reg-calendar__selected-cell'>
                <div className='reg-calendar__badge'>
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

      <Select
        placeholder='Please select store'
        optionLabelProp='label'
        style={{ width: '100%' }}>
        {masterList?.map((master) => {
          const content =
            selectOptionContent(master);
          return (
            <Option
              key={master.id}
              value={master.name}
              label={content}>
              {content}
            </Option>
          );
        })}
      </Select>
    </>
  );
}
