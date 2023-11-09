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
import {
  setRegCardInfo,
  setRegCardUser,
  setDraggableRegCard,
} from '../../reducers/regCardSlice';
import RegModal from '../../components/RegModal/RegModal';

export default function Planner() {
  const { data: regList } =
    useGetActualRegistrationListQuery();
  const { data: masterList } =
    useGetMasterListQuery();

  const { currentMaster } = useAppSelector(
    (state) => state.mastersState
  );
  const { isRegFormActive } = useAppSelector(
    (state) => state.regState
  );

  const dispatch = useAppDispatch();

  function handleMasterChange(value: string) {
    const master = masterList?.find(
      (master) => master.id === value
    );
    dispatch(setPrevMaster(currentMaster));
    dispatch(setCurrentMaster(master));
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

  useEffect(() => {
    if (isRegFormActive) {
      dispatch(setRegCardInfo(null));
      dispatch(setRegCardUser(null));
      dispatch(setDraggableRegCard(null));
    }
  }, [isRegFormActive]);

  return (
    <div className='planner'>
      <MastersSelect
        isAllOption={false}
        currentMaster={currentMaster}
        onChange={handleMasterChange}
      />{' '}
      <RegForm />
      <PlannerCalendar />
      <Todos />
      <RegModal />
    </div>
  );
}
