import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

export default function ProtectedRoute(props: RouteProps) {
  return <Route {...props} />;
}

