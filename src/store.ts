import {
  configureStore,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import appReducer from './features/App/appSlice';
import plannerReducer from './features/Planner/plannerSlice';
import { apiSlice } from './features/api/apiSlise';
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
