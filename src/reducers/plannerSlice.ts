import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

interface PlannerState {
  currentTodoListName: 'reg' | 'notes';
}
const initialState: PlannerState = {
  currentTodoListName: 'reg',
};

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    setCurrentTodoListName: (
      state,
      action: PayloadAction<'reg' | 'notes'>
    ) => {
      state.currentTodoListName = action.payload;
    },
  },
});

export const { setCurrentTodoListName } =
  plannerSlice.actions;

export default plannerSlice.reducer;
