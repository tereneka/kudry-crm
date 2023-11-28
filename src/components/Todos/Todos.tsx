import './Todos.css';
import { useAppSelector } from '../../store';
import RegTodos from '../RegTodos/RegTodos';
import NotesTodos from '../NotesTodos/NotesTodos';

export default function Todos() {
  const { currentTodoListName } = useAppSelector(
    (state) => state.plannerState
  );

  return (
    <div className='todos'>
      {currentTodoListName === 'reg' && (
        <RegTodos />
      )}
      {currentTodoListName === 'notes' && (
        <NotesTodos />
      )}
    </div>
  );
}
