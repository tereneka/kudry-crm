import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { DbRegistration, Client } from '../types';

interface RegCardState {
  regCardInfo: DbRegistration | null;
  regCardUser: Client | undefined | null;
  draggableRegCard: string | null;
}

const initialState: RegCardState = {
  regCardInfo: null,
  regCardUser: null,
  draggableRegCard: null,
};

const regCardSlice = createSlice({
  name: 'regCard',
  initialState,
  reducers: {
    setRegCardInfo: (
      state,
      action: PayloadAction<DbRegistration | null>
    ) => {
      state.regCardInfo = action.payload;
    },

    setRegCardUser: (
      state,
      action: PayloadAction<
        Client | undefined | null
      >
    ) => {
      state.regCardUser = action.payload;
    },

    setDraggableRegCard: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.draggableRegCard = action.payload;
    },
  },
});

export const {
  setRegCardInfo,
  setRegCardUser,
  setDraggableRegCard,
} = regCardSlice.actions;

export default regCardSlice.reducer;
