import React, { useState } from 'react'
import './App.css';
import MyCalendar from './components/MyCalendar';
import RegCalendar from './components/RegCalendar';
import TimeTable from './components/TimeTable';
import UserRegForm from './components/UserRegForm';

function App() {
  const [date, setDate] = useState(new Date().toLocaleDateString())

  return (
    <div className="">
      <MyCalendar setDate={setDate} />
      <RegCalendar />
      <TimeTable date={date} />
      <UserRegForm />
    </div>
  );
}

export default App;
