import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

interface FinanceState {
  isExpensesFormOpened: boolean;
}

const initialState: FinanceState = {
  isExpensesFormOpened: false,
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setIsExpensesFormOpened: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isExpensesFormOpened = action.payload;
    },
  },
});

export const { setIsExpensesFormOpened } =
  financeSlice.actions;

export default financeSlice.reducer;
