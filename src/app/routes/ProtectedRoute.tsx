import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { isAuthed } from "@/shared/http";

type Props = RouteProps & { component: React.ComponentType<any> };

export default function ProtectedRoute({ component: Component, ...rest }: Props) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthed() ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}
