import React, {
  useEffect,
  useState,
} from 'react';
import RegCalendar from '../Planner/Planner';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { setIsMobile } from './appSlice';
import Planner from '../Planner/Planner';
// import MyCalendar from './components/MyCalendar';
// import RegCalendar from './components/RegCalendar';
// import TimeTable from './components/TimeTable';
// import UserRegForm from './components/UserRegForm';

function App() {
  const { isMobile } = useAppSelector(
    (state) => state.appState
  );
  const dispatch = useAppDispatch();

  window.addEventListener('resize', () =>
    setTimeout(() => {
      if (window.innerWidth < 769) {
        dispatch(setIsMobile(true));
      } else {
        dispatch(setIsMobile(false));
      }
    }, 1000)
  );

  return (
    <div className=''>
      <Planner />
      {/* <MyCalendar setDate={setDate} />
      <RegCalendar />
      <TimeTable date={date} />
      <UserRegForm /> */}
    </div>
  );
}

export default App;
