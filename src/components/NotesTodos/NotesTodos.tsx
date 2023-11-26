import React from 'react';
import { useAppSelector } from '../../store';
import { convertDbDateToStr } from '../../utils/date';
import { useGetUserListQuery } from '../../reducers/apiSlice';
import NoteCard from '../NoteCard/NoteCard';

export default function NotesTodos() {
  const { masterNoteList } = useAppSelector(
    (state) => state.notesState
  );
  const { date } = useAppSelector(
    (state) => state.calendarState
  );

  const { data: userList } =
    useGetUserListQuery();

  return (
    <div className='notes-todos'>
      {masterNoteList
        ?.filter(
          (note) =>
            convertDbDateToStr(note.date) === date
        )
        .sort((a, b) =>
          a.time.localeCompare(b.time)
        )
        .map((note, index) => {
          const user = userList?.find(
            (user) => user.id === note.userId
          );

          return (
            <NoteCard
              note={note}
              user={user}
              index={index}
              key={note.id}
            />
          );
        })}
    </div>
  );
}
