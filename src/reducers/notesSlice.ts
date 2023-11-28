import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { DbNote } from '../types';

interface NotesState {
  masterNoteList: DbNote[] | undefined;
}
const initialState: NotesState = {
  masterNoteList: undefined,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    filterNoteListByMasterId: (
      state,
      action: PayloadAction<{
        masterId: string;
        noteList: DbNote[];
      }>
    ) => {
      const { masterId, noteList } =
        action.payload;

      state.masterNoteList = noteList.filter(
        (reg) => reg.masterId === masterId
      );
    },
  },
});

export const { filterNoteListByMasterId } =
  notesSlice.actions;

export default notesSlice.reducer;
