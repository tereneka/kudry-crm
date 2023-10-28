import './Todos.css';
import { useAppSelector } from '../../store';
import { nanoid } from 'nanoid';
import person from '../../images/person.svg';
import { Tooltip } from 'antd';
import { TIME_LIST } from '../../constants';

export default function Todos() {
  const { date } = useAppSelector(
    (state) => state.calendarState
  );

  const { masterRegList } = useAppSelector(
    (state) => state.regState
  );

  const regList = masterRegList
    ?.filter(
      (reg) =>
        reg.date.toDate().toLocaleDateString() ===
        date
    )
    .map((reg, index) => {
      return (
        <div
          className='todos__reg-card'
          style={{
            height:
              reg.time.length * 28 +
              (reg.time.length - 1) * 4,
            top:
              20 +
              TIME_LIST.indexOf(reg.time[0]) * 32,
          }}
          key={nanoid()}
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData(
              'index',
              index.toString()
            );
          }}>
          <div className='todos__reg-card-item'>
            <img src={person} alt='' />
            {reg.userName}
          </div>
          {/* <a
            className='todo-list__reg-card-link'
            href={`tel:${reg.phone}`}>
            <img src={phone} alt='' />
            {reg.phone}
          </a> */}
        </div>
      );
    });

  return (
    <div className='todos'>
      {TIME_LIST.map((time) => (
        <div
          className='todos__time-table'
          key={time}>
          <div className='todos__time-table-cell'>
            {time}
          </div>
          <Tooltip title='добавить запись'>
            <div className='todos__time-table-cell' />
          </Tooltip>
          <Tooltip title='добавить напоминание'>
            <div className='todos__time-table-cell' />
          </Tooltip>
        </div>
      ))}
      {regList}
    </div>
  );
}
