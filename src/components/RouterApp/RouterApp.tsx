import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Planner from '../../pages/Planner/Planner';
import Login from '../Login/Login';
import { useAppSelector } from '../../store';

export default function RouterApp() {
  const { currentAccount } = useAppSelector(
    (state) => state.appState
  );

  return (
    <Routes>
      <Route
        path='/'
        element={
          <ProtectedRoute
            element={Planner}
            loggedIn={!!currentAccount}
          />
        }
      />

      <Route
        path='/sign-in'
        element={<Login />}
      />
    </Routes>
  );
}
