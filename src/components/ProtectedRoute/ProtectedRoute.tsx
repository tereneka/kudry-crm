import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Planner from '../../pages/Planner/Planner';

interface ProtectedRouteProps {
  element: (props: any) => JSX.Element;
  loggedIn: boolean;
  props?: any[];
}

export default function ProtectedRoute({
  element: Component,
  loggedIn,
  ...props
}: ProtectedRouteProps) {
  return loggedIn ? (
    <Component {...props} />
  ) : (
    <Navigate to='/sign-in' replace />
  );
}
