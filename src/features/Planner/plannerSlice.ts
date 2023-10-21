import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { Master } from '../../types';

interface PlannerState {
  date: Date;
  currentMaster: string | null;
}
const initialState: PlannerState = {
  date: new Date(),
  currentMaster: null,
};

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    setDate: (
      state,
      action: PayloadAction<Date>
    ) => {
      state.date = action.payload;
    },

    setCurrentMaster: (
      state,
      action: PayloadAction<string>
    ) => {
      state.currentMaster = action.payload;
    },
  },
});

export const { setDate, setCurrentMaster } =
  plannerSlice.actions;

export default plannerSlice.reducer;
