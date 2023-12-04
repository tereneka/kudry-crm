import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { DbRegistration, Master } from '../types';

interface RegState {
  masterRegList: DbRegistration[] | undefined;
  regFormTime: string;
  regFormDuration: string;
  isRegModalOpened: boolean;
}
const initialState: RegState = {
  masterRegList: undefined,
  regFormTime: '',
  regFormDuration: '',
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

    setRegFormTime: (
      state,
      action: PayloadAction<string>
    ) => {
      state.regFormTime = action.payload;
    },

    setRegFormDuration: (
      state,
      action: PayloadAction<string>
    ) => {
      state.regFormDuration = action.payload;
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
  setRegFormTime,
  setRegFormDuration,
  setIsRegModalOpened,
} = regSlice.actions;

export default regSlice.reducer;
