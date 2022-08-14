// Mileston 3 Requirement Checklist:
// 1) Form 1 - login
//    Form 2 - Register
//    Ajax 1 - from '/' to '/login'
//    Ajax 2 - from '/' to '/register'

// 2) README is up to date
// 3) deployed to heroku
// 4) Form submitted
//
//
//
//
//
//
//
//
//
//

import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import 'bootswatch/dist/slate/bootstrap.min.css';
import './App.css';

import Home from './components/Home';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Play from './components/Play';
import Layout from './components/Layout';
import Account from './components/Account';
import RequireAuth from './components/RequireAuth';

const App = () => {
  return (
    <div className='App'>
      <Routes>
        <Route
          path='/'
          element={<Layout />}>
          {/* public routes */}
          <Route
            path='/'
            element={<Home />}
          />

          <Route
            path='/register'
            element={<RegisterForm />}
          />

          <Route
            path='/login'
            element={<LoginForm />}
          />

          {/* private route */}
          <Route element={<RequireAuth />}>
            <Route
              path='/play'
              element={<Play />}
            />
          </Route>

          <Route element={<RequireAuth />}>
            <Route
              path='/account'
              element={<Account />}
            />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
