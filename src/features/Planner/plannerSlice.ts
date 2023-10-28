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
  isRegFormOpen: boolean;
  isUserFormOpen: boolean;
}
const initialState: PlannerState = {
  date: new Date().toLocaleDateString(),
  currentMaster: null,
  currentMasterRegList: undefined,
  isRegFormOpen: false,
  isUserFormOpen: false,
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

    setIsRegFormOpen: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isRegFormOpen = action.payload;
    },

    setIsUserFormOpen: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isUserFormOpen = action.payload;
    },
  },
});

export const {
  setDate,
  // setCurrentMaster,
  setCurrentMasterRegList,
  setIsRegFormOpen,
  setIsUserFormOpen,
} = plannerSlice.actions;

export default plannerSlice.reducer;
