import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import {
  Master,
  Registration,
} from '../../types';

interface PlannerState {
  date: string;
  currentMaster: string | null;
  currentMasterRegList:
    | Registration[]
    | undefined;
}
const initialState: PlannerState = {
  date: new Date().toLocaleDateString(),
  currentMaster: null,
  currentMasterRegList: undefined,
};

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    setDate: (
      state,
      action: PayloadAction<string>
    ) => {
      state.date = action.payload;
    },

    setCurrentMaster: (
      state,
      action: PayloadAction<string>
    ) => {
      state.currentMaster = action.payload;
    },

    setCurrentMasterRegList: (
      state,
      action: PayloadAction<
        Registration[] | undefined
      >
    ) => {
      state.currentMasterRegList = action.payload;
    },
  },
});

export const {
  setDate,
  setCurrentMaster,
  setCurrentMasterRegList,
} = plannerSlice.actions;

export default plannerSlice.reducer;
