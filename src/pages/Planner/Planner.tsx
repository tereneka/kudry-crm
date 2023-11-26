import './Planner.css';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import {
  useGetMasterListQuery,
  useGetNoteListQuery,
  useGetRegistrationListQuery,
} from '../../reducers/apiSlice';
import MastersSelect from '../../components/MasterSelect/MasterSelect';
import { useEffect } from 'react';

import {
  filterRegListByMasterId,
  setIsRegFormActive,
} from '../../reducers/regSlice';
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
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../db/firebaseConfig';
import NoteForm from '../../components/NoteForm/NoteForm';
import { setIsNoteFormActive } from '../../reducers/notesSlice';

export default function Planner() {
  const { data: regList } =
    useGetRegistrationListQuery(7);
  const { data: noteList } =
    useGetNoteListQuery(1);
  const { data: masterList } =
    useGetMasterListQuery();

  const { currentMaster } = useAppSelector(
    (state) => state.mastersState
  );
  const { currentTodoListName } = useAppSelector(
    (state) => state.plannerState
  );
  const { isRegFormActive } = useAppSelector(
    (state) => state.regState
  );
  const { regCardInfo, regCardUser } =
    useAppSelector((state) => state.regCardState);

  const dispatch = useAppDispatch();

  function handleMasterChange(value: string) {
    const master = masterList?.find(
      (master) => master.id === value
    );
    dispatch(setPrevMaster(currentMaster));
    dispatch(setCurrentMaster(master));
  }

  useEffect(() => {
    if (currentTodoListName === 'notes') {
      dispatch(setIsRegFormActive(false));
    } else {
      dispatch(setIsNoteFormActive(false));
    }
  }, [currentTodoListName]);

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
      <div className='planner__container'>
        <MastersSelect
          isAllOption={false}
          currentMaster={currentMaster}
          onChange={handleMasterChange}
        />
        <Button type='primary'>
          <Link
            to={'/sign-in'}
            onClick={() => signOut(auth)}>
            выйти
          </Link>
        </Button>
      </div>

      <PlannerCalendar />
      <Todos />

      {currentTodoListName === 'reg' && (
        <>
          <RegForm />
          <RegModal
            reg={regCardInfo}
            user={regCardUser}
          />
        </>
      )}
      {currentTodoListName === 'notes' && (
        <NoteForm />
      )}
    </div>
  );
}
