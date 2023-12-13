import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { DbNote, Client } from '../types';

interface NoteCardState {
  noteCardInfo: DbNote | null;
  noteCardUser: Client | undefined | null;
}

const initialState: NoteCardState = {
  noteCardInfo: null,
  noteCardUser: null,
};

const noteCardSlice = createSlice({
  name: 'noteCard',
  initialState,
  reducers: {
    setNoteCardInfo: (
      state,
      action: PayloadAction<DbNote | null>
    ) => {
      state.noteCardInfo = action.payload;
    },

    setNoteCardUser: (
      state,
      action: PayloadAction<
        Client | undefined | null
      >
    ) => {
      state.noteCardUser = action.payload;
    },
  },
});

export const {
  setNoteCardInfo,
  setNoteCardUser,
} = noteCardSlice.actions;

export default noteCardSlice.reducer;
