import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { DbNote, Note } from '../types';
import { INITIAL_NOTE_FORM_VALUES } from '../constants';

interface NotesState {
  masterNoteList: DbNote[] | undefined;
  isNoteFormActive: boolean;
  noteFormValues: Note;
  isNoteModalOpened: boolean;
}
const initialState: NotesState = {
  masterNoteList: undefined,
  isNoteFormActive: false,
  noteFormValues: INITIAL_NOTE_FORM_VALUES,
  isNoteModalOpened: false,
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

    setNoteFormValues: (
      state,
      action: PayloadAction<Note>
    ) => {
      state.noteFormValues = action.payload;
    },

    setIsNoteModalOpened: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isNoteModalOpened = action.payload;
    },
  },
});

export const {
  filterNoteListByMasterId,
  setIsNoteFormActive,
  setNoteFormValues,
  setIsNoteModalOpened,
} = notesSlice.actions;

export default notesSlice.reducer;
