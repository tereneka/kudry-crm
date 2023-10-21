import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

interface PlannerState {
  date: Date;
}
const initialState: PlannerState = {
  date: new Date(),
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
  },
});

export const { setDate } = plannerSlice.actions;

export default plannerSlice.reducer;
