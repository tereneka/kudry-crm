import './NoteCard.css';
import { DbNote, Client } from '../../types';
import { phoneFormat } from '../../utils/format';
import { useAppDispatch } from '../../store';
import { useEffect } from 'react';
import { Button } from 'antd';
import {
  DeleteOutlined,
  EditFilled,
} from '@ant-design/icons';
import {
  setNoteCardInfo,
  setNoteCardUser,
} from '../../reducers/noteCardSlice';
import { useDeleteNoteMutation } from '../../reducers/apiSlice';
import { setIsError } from '../../reducers/appSlice';
import { setOpenedFormName } from '../../reducers/plannerSlice';
import AlternateColorCard from '../AlternateColorCard/AlternateColorCard';
import CardMenu from '../CardMenu/CardMenu';

interface NoteCardProps {
  note: DbNote;
  user: Client | undefined;
  index?: number;
}

export default function NoteCard({
  note,
  user,
  index = 0,
}: NoteCardProps) {
  const [deleteNote, { isError }] =
    useDeleteNoteMutation();

  const dispatch = useAppDispatch();

  const editBtnGroup = [
    {
      label: (
        <Button
          size='large'
          type='text'
          icon={
            <EditFilled
              rev={undefined}
              className='note-card__icon'
            />
          }
          onClick={handleEditBtnClick}
        />
      ),
      key: '4',
    },
    {
      label: (
        <Button
          size='large'
          type='text'
          icon={
            <DeleteOutlined
              rev={undefined}
              className='note-card__icon'
            />
          }
          onClick={() => deleteNote(note.id)}
        />
      ),
      key: '5',
    },
  ];

  function handleEditBtnClick() {
    dispatch(setNoteCardInfo(note));
    dispatch(setNoteCardUser(user));
    dispatch(setOpenedFormName('editNote'));
  }

  useEffect(() => {
    dispatch(setIsError(isError));
  }, [isError]);

  return (
    <AlternateColorCard
      className='note-card'
      key={note.id}>
      <CardMenu
        color={
          index % 2 === 0 ? 'danger' : 'primary'
        }
        phone={user?.phone}
        otherBtnGroup={editBtnGroup}
      />

      <p className='note-card__time'>
        {note.time}
      </p>

      <div className='note-card__box'>
        <p className='note-card__text'>
          {note.text}
        </p>
      </div>

      {user && (
        <div className='note-card__box'>
          <p className='note-card__name'>
            {user?.name}
          </p>

          <div className='note-card__contacts'>
            <span>
              {phoneFormat(user?.phone)}
            </span>
          </div>
        </div>
      )}
    </AlternateColorCard>
  );
}
