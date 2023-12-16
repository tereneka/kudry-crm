import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

interface AppState {
  currentAccount: User | null | undefined;
  isError: boolean;
}
const initialState: AppState = {
  currentAccount: undefined,
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

    setCurrentAccount: (
      state,
      action: PayloadAction<User | null>
    ) => {
      state.currentAccount = action.payload;
    },
  },
});

export const { setCurrentAccount, setIsError } =
  appSlice.actions;

export default appSlice.reducer;
