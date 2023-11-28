import './Todos.css';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { Button, Radio, Tooltip } from 'antd';
import { SelectOutlined } from '@ant-design/icons';
import { useState } from 'react';
import personIconBlack from '../../images/person-lines-black.svg';
import notesIconBlack from '../../images/notes-black.svg';
import personIconWhite from '../../images/person-lines-white.svg';
import notesIconWhite from '../../images/notes-white.svg';
import {
  setCurrentTodoListName,
  setIsFormActive,
} from '../../reducers/plannerSlice';
import RegTodos from '../RegTodos/RegTodos';
import NotesTodos from '../NotesTodos/NotesTodos';

export default function Todos() {
  const { currentTodoListName } = useAppSelector(
    (state) => state.plannerState
  );

  const dispatch = useAppDispatch();

  const [
    isTimeSelectAvailable,
    setIsTimeSelectAvailable,
  ] = useState(false);

  function toggleTimeSelectBtn() {
    setIsTimeSelectAvailable(
      !isTimeSelectAvailable
    );
  }

  function handleTodoListChange(
    todoListName: 'reg' | 'notes'
  ) {
    dispatch(
      setCurrentTodoListName(todoListName)
    );
    dispatch(setIsFormActive(false));
  }

  return (
    <div className='todos'>
      <div className='todos__btn-group'>
        {currentTodoListName === 'reg' && (
          <Tooltip title='выбрать время'>
            <Button
              icon={
                <SelectOutlined rev={undefined} />
              }
              type='primary'
              danger={!isTimeSelectAvailable}
              onClick={toggleTimeSelectBtn}
            />
          </Tooltip>
        )}
        <Radio.Group
          className='todos__radio-group'
          defaultValue={currentTodoListName}
          buttonStyle='solid'
          onChange={(e) =>
            handleTodoListChange(e.target.value)
          }>
          <Radio.Button
            className='todos__radio-btn'
            value={'reg'}>
            <div className='todos__radio-content'>
              <img
                src={
                  currentTodoListName === 'reg'
                    ? personIconWhite
                    : personIconBlack
                }
                alt=''
              />
              <span>записи</span>
            </div>
          </Radio.Button>
          <Radio.Button
            value={'notes'}
            className='todos__radio-btn'>
            <div className='todos__radio-content'>
              <img
                src={
                  currentTodoListName === 'notes'
                    ? notesIconWhite
                    : notesIconBlack
                }
                alt=''
              />
              <span>напоминалки</span>
            </div>
          </Radio.Button>
        </Radio.Group>
      </div>
      {currentTodoListName === 'reg' && (
        <RegTodos
          isTimeSelectAvailable={
            isTimeSelectAvailable
          }
          setIsTimeSelectAvailable={
            setIsTimeSelectAvailable
          }
        />
      )}
      {currentTodoListName === 'notes' && (
        <NotesTodos />
      )}
    </div>
  );
}
