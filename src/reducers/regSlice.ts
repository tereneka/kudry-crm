import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { Registration } from '../types';

interface RegState {
  masterRegList: Registration[] | undefined;
}
const initialState: RegState = {
  masterRegList: undefined,
};

const regSlice = createSlice({
  name: 'reg',
  initialState,
  reducers: {
    filterRegListByMasterId: (
      state,
      action: PayloadAction<{
        masterId: string;
        regList: Registration[];
      }>
    ) => {
      const { masterId, regList } =
        action.payload;

      state.masterRegList = regList.filter(
        (reg) => reg.masterId === masterId
      );
    },
  },
});

export const { filterRegListByMasterId } =
  regSlice.actions;

export default regSlice.reducer;
