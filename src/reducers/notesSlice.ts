import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { DbNote } from '../types';

interface NotesState {
  masterNoteList: DbNote[] | undefined;
  isNoteFormActive: boolean;
  openedNoteForm: '' | 'add' | 'edit';
}
const initialState: NotesState = {
  masterNoteList: undefined,
  isNoteFormActive: false,
  openedNoteForm: '',
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

    setIsNoteFormActive: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isNoteFormActive = action.payload;
    },

    setOpenedNoteForm: (
      state,
      action: PayloadAction<'' | 'add' | 'edit'>
    ) => {
      state.openedNoteForm = action.payload;
    },
  },
});

export const {
  filterNoteListByMasterId,
  setIsNoteFormActive,
  setOpenedNoteForm,
} = notesSlice.actions;

export default notesSlice.reducer;
