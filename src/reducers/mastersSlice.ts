import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

interface MastersState {
  currentMaster: string | null;
}
const initialState: MastersState = {
  currentMaster: null,
};

const mastersSlice = createSlice({
  name: 'masters',
  initialState,
  reducers: {
    setCurrentMaster: (
      state,
      action: PayloadAction<string>
    ) => {
      state.currentMaster = action.payload;
    },
  },
});

export const { setCurrentMaster } =
  mastersSlice.actions;

export default mastersSlice.reducer;
