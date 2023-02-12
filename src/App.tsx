import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { Route, Routes } from 'react-router-dom';

import { store, history } from './store/store';
import { Home, Login, Signup, TimerApp, Account } from './containers';
import { BaseLayout } from './components/layout';
import { Routes as AppRoutes } from './config/constants';

import { invoke } from '@tauri-apps/api';

const App = () => {
  useEffect(() => {
    console.log('APP', '__TAURI__' in window);
  }, []);
  // now we can call our Command!
  // Right-click the application background and open the developer tools.
  // You will see "Hello, World!" printed in the console!
  // void invoke('greet', { name: 'World' })
  //   // `invoke` returns a Promise
  //   .then((response) => console.log(response));

  return (
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
};

export default App;
