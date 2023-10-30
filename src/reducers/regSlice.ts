import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import {
  DbRegistration,
  Registration,
} from '../types';
import { INITIAL_REG_FORM_VALUES } from '../constants';

interface RegFormValues {
  userId: string | undefined;
  serviceIdList: string[] | undefined;
  masterId: string | undefined;
  date: Date;
  time: string[] | undefined;
}

interface RegState {
  masterRegList: DbRegistration[] | undefined;
  regFormValues: RegFormValues;
  regStartTime: string | undefined;
  regDuration: number;
  isTimeError: boolean;
  isDateError: boolean;
}
const initialState: RegState = {
  masterRegList: undefined,
  regFormValues: INITIAL_REG_FORM_VALUES,
  regStartTime: undefined,
  regDuration: 0,
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

    setRegStartTime: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.regStartTime = action.payload;
    },

    setRegDuration: (
      state,
      action: PayloadAction<number>
    ) => {
      state.regDuration = action.payload;
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
  setRegStartTime,
  setRegDuration,
  setIsTimeError,
  setIsDateError,
} = regSlice.actions;

export default regSlice.reducer;
