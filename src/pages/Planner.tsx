import {
  useAppDispatch,
  useAppSelector,
} from '../store';
import {
  useGetActualRegistrationListQuery,
  useGetMasterListQuery,
} from '../reducers/apiSlice';
import MastersSelect from '../components/MasterSelect/MasterSelect';
import { setDate } from '../features/Planner/plannerSlice';
import { useEffect } from 'react';

import { filterRegListByMasterId } from '../reducers/regSlice';
import {
  setCurrentMaster,
  setPrevMaster,
} from '../reducers/mastersSlice';
import PlannerCalendar from '../components/PlannerCalendar/PlannerCalendar';
import Todos from '../components/Todos/Todos';
import RegForm from '../components/RegForm/RegForm';

export default function Planner() {
  const { data: regList } =
    useGetActualRegistrationListQuery();
  const { data: masterList } =
    useGetMasterListQuery();

  const { currentMaster } = useAppSelector(
    (state) => state.mastersState
  );

  const dispatch = useAppDispatch();

  function handleMasterChange(value: string) {
    const master = masterList?.find(
      (master) => master.id === value
    );
    dispatch(setPrevMaster(currentMaster));
    dispatch(setCurrentMaster(master));
    dispatch(
      setDate(new Date().toLocaleDateString())
    );
  }

  useEffect(() => {
    if (currentMaster && regList) {
      dispatch(
        filterRegListByMasterId({
          masterId: currentMaster.id,
          regList,
        })
      );
    }
  }, [regList, currentMaster]);

  return (
    <div className='planner'>
      <MastersSelect
        isAllOption={false}
        currentMaster={currentMaster}
        onChange={handleMasterChange}
      />{' '}
      <PlannerCalendar />
      <Todos />
      <RegForm />
    </div>
  );
}
