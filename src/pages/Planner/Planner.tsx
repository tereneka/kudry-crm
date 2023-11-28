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
import { Badge, Button } from 'antd';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../db/firebaseConfig';
import NoteForm from '../../components/NoteForm/NoteForm';
import { filterNoteListByMasterId } from '../../reducers/notesSlice';
import {
  setIsFormActive,
  setOpenedFormName,
} from '../../reducers/plannerSlice';

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
  const { currentTodoListName, isFormActive } =
    useAppSelector((state) => state.plannerState);
  const { regFormDuration } = useAppSelector(
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

  function openForm() {
    if (currentTodoListName === 'reg') {
      dispatch(setOpenedFormName('addReg'));
    } else {
      dispatch(setOpenedFormName('addNote'));
    }
    dispatch(setIsFormActive(true));
  }

  useEffect(() => {
    dispatch(setIsFormActive(false));
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
    if (currentMaster && noteList) {
      dispatch(
        filterNoteListByMasterId({
          masterId: currentMaster.id,
          noteList,
        })
      );
    }
  }, [noteList, currentMaster]);

  useEffect(() => {
    if (isFormActive) {
      dispatch(setRegCardInfo(null));
      dispatch(setRegCardUser(null));
      dispatch(setDraggableRegCard(null));
    }
  }, [isFormActive]);

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
        <>
          <NoteForm />
          <NoteForm />
        </>
      )}

      <Badge
        className='planner__open-form-btn'
        count={
          currentTodoListName === 'reg' &&
          isFormActive
            ? (regFormDuration || 0) + 'ч.'
            : 0
        }
        showZero={false}
        size='small'
        offset={[-20, 0]}>
        <Button
          type='primary'
          danger={!isFormActive}
          onClick={openForm}>
          {currentTodoListName === 'reg'
            ? 'новая запись'
            : 'новая напоминалка'}
        </Button>
      </Badge>
    </div>
  );
}
