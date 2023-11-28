import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Planner from '../../pages/Planner/Planner';
import Login from '../Login/Login';
import { useAppSelector } from '../../store';
import Main from '../Main/Main';

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
            <Navigate to={'/planner'} />
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
        <Route path='/main' element={<Main />} />
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
    </Routes>
  );
}
