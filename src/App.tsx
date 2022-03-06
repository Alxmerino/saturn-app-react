import React from 'react';
import { Provider } from 'react-redux';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { store, history } from './store/store';
import { Route, Routes } from 'react-router-dom';

import { Home, Login, Signup, TimerApp } from './containers';

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<TimerApp />} />
      </Routes>
    </Router>
  </Provider>
);

export default App;
