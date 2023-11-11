import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

interface AppState {
  isError: boolean;
}
const initialState: AppState = {
  isError: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsError: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isError = action.payload;
    },
  },
});

export const { setIsError } = appSlice.actions;

export default appSlice.reducer;
