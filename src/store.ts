import {
  configureStore,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import plannerReducer from './features/Planner/plannerSlice';
import calendarReducer from './reducers/calendarSlice';
import regReducer from './reducers/regSlice';
import regCardReducer from './reducers/regCardSlice';
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
    plannerState: plannerReducer,
    calendarState: calendarReducer,
    regState: regReducer,
    regCardState: regCardReducer,
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
