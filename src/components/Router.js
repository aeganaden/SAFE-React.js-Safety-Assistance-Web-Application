import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from '../App';
import Administrator from './Administrator/';
import Dashboard from './Administrator/Dashboard';
import Reports from './Administrator/Reports';
import Users from './Administrator/Users';
import Administrators from './Administrator/Administrators';
import NotFound from './NotFound';
const Router = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path="/" component={App} />
        <Route
          path="/administrator"
          render={() => (
            <Administrator>
              <Dashboard />
            </Administrator>
          )}
        />

        <Route
          path="/reports"
          render={() => (
            <Administrator>
              <Reports />
            </Administrator>
          )}
        />

        <Route
          path="/manage-users"
          render={() => (
            <Administrator>
              <Users />
            </Administrator>
          )}
        />

        <Route
          path="/manage-administrators"
          render={() => (
            <Administrator>
              <Administrators />
            </Administrator>
          )}
        />

        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
