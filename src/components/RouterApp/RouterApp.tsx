import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import Planner from '../../pages/Planner/Planner';
import Login from '../../pages/Login/Login';
import { useAppSelector } from '../../store';
import Finance from '../../pages/Finance/Finance';

export default function RouterApp() {
  const { currentAccount } = useAppSelector(
    (state) => state.appState
  );

  return (
    <Routes>
      <Route
        path='/'
        element={
          !!currentAccount ? (
            <Navigate
              to={
                localStorage.getItem(
                  'location'
                ) || '/planner'
              }
            />
          ) : (
            <Navigate to={'/sign-in'} />
          )
        }
      />
      <Route
        element={
          !!currentAccount ? (
            <Outlet />
          ) : (
            <Navigate to={'/sign-in'} />
          )
        }>
        <Route
          path='/planner'
          element={<Planner />}
        />
        <Route
          path='/finance'
          element={<Finance />}
        />
      </Route>

      <Route
        element={
          !!currentAccount ? (
            <Navigate to={'/'} />
          ) : (
            <Outlet />
          )
        }>
        <Route
          path='/sign-in'
          element={<Login />}
        />
      </Route>

      <Route
        path='*'
        element={
          !!currentAccount ? (
            <Navigate
              to={
                localStorage.getItem(
                  'location'
                ) || '/planner'
              }
            />
          ) : (
            <Navigate to={'/sign-in'} />
          )
        }
      />
    </Routes>
  );
}
