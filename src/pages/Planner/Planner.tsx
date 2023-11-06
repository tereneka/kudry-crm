import './Planner.css';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import {
  useGetActualRegistrationListQuery,
  useGetMasterListQuery,
} from '../../reducers/apiSlice';
import MastersSelect from '../../components/MasterSelect/MasterSelect';
import { setDate } from '../../features/Planner/plannerSlice';
import { useEffect } from 'react';

import { filterRegListByMasterId } from '../../reducers/regSlice';
import {
  setCurrentMaster,
  setPrevMaster,
} from '../../reducers/mastersSlice';
import PlannerCalendar from '../../components/PlannerCalendar/PlannerCalendar';
import Todos from '../../components/Todos/Todos';
import RegForm from '../../components/RegForm/RegForm';
import RegCard from '../../components/RegCard/RegCard';

export default function Planner() {
  const { data: regList } =
    useGetActualRegistrationListQuery();
  const { data: masterList } =
    useGetMasterListQuery();

  const { currentMaster } = useAppSelector(
    (state) => state.mastersState
  );
  const {
    regCardInfo,
    regCardUser,
    isRegCardCopyVisible,
  } = useAppSelector(
    (state) => state.regCardState
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
      {regCardInfo && isRegCardCopyVisible && (
        <RegCard
          reg={regCardInfo}
          user={regCardUser || undefined}
          className='planner__reg-card'
        />
      )}
      <MastersSelect
        isAllOption={false}
        currentMaster={currentMaster}
        onChange={handleMasterChange}
      />{' '}
      <RegForm />
      <PlannerCalendar />
      <Todos />
    </div>
  );
}
