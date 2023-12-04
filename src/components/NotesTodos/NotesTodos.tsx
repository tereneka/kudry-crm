import React from 'react';
import { useAppSelector } from '../../store';
import { convertDbDateToStr } from '../../utils/date';
import { useGetUserListQuery } from '../../reducers/apiSlice';
import NoteCard from '../NoteCard/NoteCard';
import { Empty } from 'antd';

export default function NotesTodos() {
  const { masterNoteList } = useAppSelector(
    (state) => state.notesState
  );
  const { date } = useAppSelector(
    (state) => state.calendarState
  );

  const { data: userList } =
    useGetUserListQuery();

  const noteListForRender = masterNoteList
    ?.filter(
      (note) =>
        convertDbDateToStr(note.date) === date
    )
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className='notes-todos'>
      {noteListForRender &&
      noteListForRender.length > 0 ? (
        noteListForRender.map((note, index) => {
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
        })
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description='нет напоминалок'
        />
      )}
    </div>
  );
}
