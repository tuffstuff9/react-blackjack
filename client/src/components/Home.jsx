import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

const Home = () => {
  return (
    <div
      className='container'
      id='home'>
      <Link to='/login'>
        <Button className='btn btn-success'>Login</Button>
      </Link>
      <Link to='/register'>
        <Button
          className='btn btn-info'
          style={{ marginLeft: 20 }}>
          Register
        </Button>
      </Link>
    </div>
  );
};

export default Home;
