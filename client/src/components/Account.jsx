import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Play.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Account = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [balance, setBalance] = useState();
  const [games, setGames] = useState();

  useEffect(() => {
    async function fetchData() {
      const user = {
        email: auth.user.email,
      };

      // console.log(user);

      const res = await axios({
        method: 'POST',
        data: user,
        url: '/users/balance',
      });

      // console.log(res.data);

      setBalance(parseInt(res.data));

      const res2 = await axios({
        method: 'GET',
        url: '/api/stats',
      });

      setGames(res2.data);
    }
    fetchData();
  }, []);

  const play = (async) => {
    navigate('/play');
  };

  const logout = async () => {
    setAuth({});
    navigate('/');
  };

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  // Code copied from stackoverflow to check for integer
  function isInt(value) {
    return (
      !isNaN(value) &&
      parseInt(Number(value)) == value &&
      !isNaN(parseInt(value, 10))
    );
  }

  const findFormErrors = () => {
    const { balanceAmount } = form;
    const newErrors = {};

    if (balanceAmount <= 0) {
      newErrors.balanceAmount = 'Minimum balance is $1';
    } else if (!isInt(balanceAmount)) {
      newErrors.balanceAmount = 'Balance must be an integer';
    }

    return newErrors;
  };

  let user = {
    email: auth.user.email,
    balance: 0,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const { balanceAmount } = form;
      setBalance(balanceAmount);
      console.log('updating balance');

      user.balance = parseInt(balanceAmount);

      const res = await axios({
        method: 'POST',
        data: user,
        url: '/users/setbalance',
      });
    }
  };

  return (
    <>
      <div className='balance-area'>
        <h3>{auth.user.username}'s Balance: &nbsp; </h3>
        <h3
          display='inline'
          style={{ color: '#66FF00', fontWeight: '700' }}>
          {' '}
          ${balance}
        </h3>
        <button
          className='deposit-button'
          onClick={play}>
          Play
        </button>
        <button
          className='signout-button'
          onClick={logout}>
          Sign Out
        </button>
      </div>

      <div className='bet-area'>
        <Form
          noValidate
          onSubmit={handleSubmit}>
          <Form.Group
            className='mb-3'
            controlId='formBasicBalance'>
            <Form.Control
              className='w-50'
              onChange={(e) => setField('balanceAmount', e.target.value)}
              type='number'
              placeholder='Enter desired balance'
              isInvalid={!!errors.balanceAmount}
            />
            <Form.Control.Feedback type='invalid'>
              {errors.balanceAmount}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            className='start-button'
            type='submit'>
            Set Balance
          </Button>
        </Form>
      </div>
      <div>
        <h3 align='center'>Global app game count: {games}</h3>
      </div>
    </>
  );
};

export default Account;
