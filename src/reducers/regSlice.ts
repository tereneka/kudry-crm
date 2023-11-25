import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { DbRegistration } from '../types';

interface RegState {
  masterRegList: DbRegistration[] | undefined;
  isRegFormActive: boolean;
  regFormTime: string;
  isRegModalOpened: boolean;
}
const initialState: RegState = {
  masterRegList: undefined,
  isRegFormActive: false,
  regFormTime: '',
  isRegModalOpened: false,
};

const regSlice = createSlice({
  name: 'reg',
  initialState,
  reducers: {
    filterRegListByMasterId: (
      state,
      action: PayloadAction<{
        masterId: string;
        regList: DbRegistration[];
      }>
    ) => {
      const { masterId, regList } =
        action.payload;

      state.masterRegList = regList.filter(
        (reg) => reg.masterId === masterId
      );
    },

    setIsRegFormActive: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isRegFormActive = action.payload;
    },

    setRegFormTime: (
      state,
      action: PayloadAction<string>
    ) => {
      state.regFormTime = action.payload;
    },

    setIsRegModalOpened: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isRegModalOpened = action.payload;
    },
  },
});

export const {
  filterRegListByMasterId,
  setIsRegFormActive,
  setRegFormTime,
  setIsRegModalOpened,
} = regSlice.actions;

export default regSlice.reducer;
