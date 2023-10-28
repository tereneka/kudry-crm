import type { Dayjs } from 'dayjs';
import { FloatButton } from 'antd';
import {
  useAppDispatch,
  useAppSelector,
} from '../store';
import { useGetActualRegistrationListQuery } from '../reducers/apiSlice';
import MastersSelect from '../components/MasterSelect/MasterSelect';
import {
  setDate,
  setIsRegFormOpen,
} from '../features/Planner/plannerSlice';
import { useEffect } from 'react';
import { DATE_FORMAT } from '../constants';
import { PlusOutlined } from '@ant-design/icons';
import { filterRegListByMasterId } from '../reducers/regSlice';
import { setCurrentMaster } from '../reducers/mastersSlice';
import PlannerCalendar from '../components/PlannerCalendar/PlannerCalendar';
import Todos from '../components/Todos/Todos';

export default function Planner() {
  const {
    data: regList,
    isLoading,
    isError,
  } = useGetActualRegistrationListQuery();

  const { masterRegList } = useAppSelector(
    (state) => state.regState
  );

  const { currentMaster } = useAppSelector(
    (state) => state.mastersState
  );

  const dispatch = useAppDispatch();

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
    if (currentMaster && regList) {
      dispatch(
        filterRegListByMasterId({
          masterId: currentMaster,
          regList,
        })
      );
    }
  }, [regList, currentMaster]);

  return (
    <div className='planner'>
      <div className='planner__add-btn-group'>
        {/* <Tooltip title='добавить запись'>
          <Button
            shape='circle'
            icon={<PlusOutlined />}
            type='primary'
            danger
            size='large'
            onClick={handleAddRegBtnClick}
          />
        </Tooltip> */}

        {/* <Tooltip title='добавить напоминание'>
          <Button
            shape='circle'
            icon={<PlusOutlined />}
            type='primary'
            size='large'
          />
        </Tooltip> */}
        <FloatButton.Group
          trigger='click'
          icon={<PlusOutlined />}
          type='primary'
          tooltip='добавить запись'
          open={true}
          // style={{ right: 94 }}
        >
          <div>bbb</div>
        </FloatButton.Group>
      </div>
      <MastersSelect
        isAllOption={false}
        currentMaster={currentMaster}
        onChange={handleMasterChange}
      />{' '}
      <PlannerCalendar />
      <Todos />
      {/* <RegForm /> */}
    </div>
  );
}
