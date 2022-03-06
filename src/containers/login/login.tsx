import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
      </ul>
      <h1>Login</h1>
    </div>
  );
};

export default Login;
