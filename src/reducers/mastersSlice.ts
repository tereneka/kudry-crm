import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { Master } from '../types';

interface MastersState {
  currentMaster: Master | null | undefined;
  prevMaster: Master | null | undefined;
}
const initialState: MastersState = {
  currentMaster: null,
  prevMaster: null,
};

const mastersSlice = createSlice({
  name: 'masters',
  initialState,
  reducers: {
    setCurrentMaster: (
      state,
      action: PayloadAction<Master | undefined>
    ) => {
      state.currentMaster = action.payload;
    },

    setPrevMaster: (
      state,
      action: PayloadAction<
        Master | undefined | null
      >
    ) => {
      state.prevMaster = action.payload;
    },
  },
});

export const { setCurrentMaster, setPrevMaster } =
  mastersSlice.actions;

export default mastersSlice.reducer;
