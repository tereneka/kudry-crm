import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { DbNote, RegUser } from '../types';

interface NoteCardState {
  noteCardInfo: DbNote | null;
  noteCardUser: RegUser | undefined | null;
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
        RegUser | undefined | null
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
