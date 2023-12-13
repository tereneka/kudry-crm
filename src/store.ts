import {
  configureStore,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import appReducer from './reducers/appSlice';
import plannerReducer from './reducers/plannerSlice';
import financeReducer from './reducers/financeSlice';
import clientsReducer from './reducers/clientsSlice';
import calendarReducer from './reducers/calendarSlice';
import regReducer from './reducers/regSlice';
import notesReducer from './reducers/notesSlice';
import regCardReducer from './reducers/regCardSlice';
import noteCardReducer from './reducers/noteCardSlice';
import mastersReducer from './reducers/mastersSlice';
import { apiSlice } from './reducers/apiSlice';
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    appState: appReducer,
    plannerState: plannerReducer,
    financeState: financeReducer,
    clientsState: clientsReducer,
    calendarState: calendarReducer,
    regState: regReducer,
    notesState: notesReducer,
    regCardState: regCardReducer,
    noteCardState: noteCardReducer,
    mastersState: mastersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

export const useAppDispatch: () => AppDispatch =
  useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> =
  useSelector;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<
  typeof store.getState
>;

export type AppThunk<ReturnType = void> =
  ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
  >;
