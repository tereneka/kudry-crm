import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

interface ClientsState {
  isClientFormOpened: boolean;
  isClientFormActive: boolean;
}

const initialState: ClientsState = {
  isClientFormOpened: false,
  isClientFormActive: false,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setIsClientFormOpened: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isClientFormOpened = action.payload;
    },

    setIsClientFormActive: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isClientFormActive = action.payload;
    },
  },
});

export const {
  setIsClientFormOpened,
  setIsClientFormActive,
} = clientsSlice.actions;

export default clientsSlice.reducer;
