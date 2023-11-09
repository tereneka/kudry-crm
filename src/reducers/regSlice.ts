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
  isRegFormActive: boolean;
  regFormValues: RegFormValues;
  isRegModalOpen: boolean;
}
const initialState: RegState = {
  masterRegList: undefined,
  isRegFormActive: false,
  regFormValues: INITIAL_REG_FORM_VALUES,
  isRegModalOpen: false,
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

    setRegFormValues: (
      state,
      action: PayloadAction<RegFormValues>
    ) => {
      state.regFormValues = action.payload;
    },

    setIsRegModalOpen: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isRegModalOpen = action.payload;
    },
  },
});

export const {
  filterRegListByMasterId,
  setIsRegFormActive,
  setRegFormValues,
  setIsRegModalOpen,
} = regSlice.actions;

export default regSlice.reducer;
