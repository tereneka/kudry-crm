import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

interface CalendarState {
  date: string;
}
const initialState: CalendarState = {
  date: new Date().toLocaleDateString(),
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setDate: (
      state,
      action: PayloadAction<string>
    ) => {
      state.date = action.payload;
    },
  },
});

export const { setDate } = calendarSlice.actions;

export default calendarSlice.reducer;
