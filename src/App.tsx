import React from 'react';
import { Provider } from 'react-redux';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { store, history } from './store/store';
import { Route, Routes } from 'react-router-dom';

import { Home, Login, Signup, TimerApp, Account } from './containers';
import { BaseLayout } from './components/layout';
import { Routes as AppRoutes } from './config/constants';

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <BaseLayout>
        <Routes>
          <Route path={AppRoutes.HOME} element={<Home />} />
          <Route path={AppRoutes.LOGIN} element={<Login />} />
          <Route path={AppRoutes.SIGNUP} element={<Signup />} />
          <Route path={AppRoutes.APP} element={<TimerApp />} />
          <Route path={AppRoutes.ACCOUNT} element={<Account />} />
        </Routes>
      </BaseLayout>
    </Router>
  </Provider>
);

export default App;
