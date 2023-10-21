import type { Dayjs } from 'dayjs';
import { Calendar } from 'antd';
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { useGetActualRegistrationListQuery } from '../api/apiSlise';
import MastersSelect from '../../components/MastersSelect';
import { setCurrentMaster } from './plannerSlice';

export default function Planner() {
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

  const dateCellRender = (date: Dayjs) => {
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
  };

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

  const handleMasterChange = (value: string) => {
    dispatch(setCurrentMaster(value));
  };

  return (
    <div className='planner'>
      <Calendar
        style={{ maxWidth: 400 }}
        dateCellRender={dateCellRender}
        fullscreen={false}
        onSelect={onSelect}
        onPanelChange={onPanelChange}
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
  );
}
