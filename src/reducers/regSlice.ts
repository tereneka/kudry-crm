import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { DbRegistration } from '../types';
import { INITIAL_REG_FORM_VALUES } from '../constants';

interface RegFormValues {
  userId: string | undefined;
  serviceIdList: string[] | undefined;
  masterId: string | undefined;
  date: Date;
  time: string | undefined;
  duration: number;
  income: number;
  serviceIndex: number;
}

interface RegState {
  masterRegList: DbRegistration[] | undefined;
  regFormValues: RegFormValues;
  isTimeError: boolean;
  isDateError: boolean;
}
const initialState: RegState = {
  masterRegList: undefined,
  regFormValues: INITIAL_REG_FORM_VALUES,
  isTimeError: false,
  isDateError: false,
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

    setRegFormValues: (
      state,
      action: PayloadAction<RegFormValues>
    ) => {
      state.regFormValues = action.payload;
    },

    setIsTimeError: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isTimeError = action.payload;
    },

    setIsDateError: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isDateError = action.payload;
    },
  },
});

export const {
  filterRegListByMasterId,
  setRegFormValues,
  setIsTimeError,
  setIsDateError,
} = regSlice.actions;

export default regSlice.reducer;
