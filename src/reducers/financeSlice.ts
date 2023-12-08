import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

interface FinanceState {
  isExpensesFormOpened: boolean;
  isExpensesFormActive: boolean;
}

const initialState: FinanceState = {
  isExpensesFormOpened: false,
  isExpensesFormActive: false,
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

    setIsExpensesFormActive: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isExpensesFormActive = action.payload;
    },
  },
});

export const {
  setIsExpensesFormOpened,
  setIsExpensesFormActive,
} = financeSlice.actions;

export default financeSlice.reducer;
