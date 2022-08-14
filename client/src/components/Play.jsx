import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Play.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Play = () => {
  const { auth, setAuth } = useAuth();
  const [gameState, setGameState] = useState(false);
  const [playerScore, setPlayerScore] = useState([]);
  const [dealerScore, setDealerScore] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [balance, setBalance] = useState();
  const [winner, setWinner] = useState(false);
  const [betValue, setBetValue] = useState(0);
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

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
    const { betAmount } = form;
    const newErrors = {};

    if (betAmount > balance) {
      newErrors.betAmount = 'Bet exceeds balance';
    } else if (betAmount <= 0) {
      newErrors.betAmount = 'Minimum bet is $1';
    } else if (!isInt(betAmount)) {
      newErrors.betAmount = 'Bet must be an integer';
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const { betAmount } = form;
      setBetValue(betAmount);
      setBalance(balance - betAmount);
      startGame();
    }
  };

  let user = {
    email: auth.user.email,
    balance: 0,
  };
  async function adjustBalance(amount, gameResult) {
    if (gameResult === 'win') {
      user.balance = balance + amount * 2;
      setBalance(balance + amount * 2);
    } else if (gameResult === 'loss') {
      setBalance(balance);
      user.balance = balance;
    } else if (gameResult === 'tie') {
      user.balance = parseInt(balance) + parseInt(amount);
      setBalance(parseInt(balance) + parseInt(amount));
    } else {
      console.log('error setting balance');
    }

    console.log('updating balance');

    const res = await axios({
      method: 'POST',
      data: user,
      url: '/users/setbalance',
    });
  }

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
    }
    fetchData();
  }, []);

  const logout = async () => {
    setAuth({});
    navigate('/');
  };

  const startGame = async () => {
    setWinner(false);
    setGameState(true);

    const res = await axios({
      method: 'GET',
      url: '/api/startgame',
    });

    console.log(res.data);

    let updatePlayer = '';

    if (res.data?.playerScore?.length === 2) {
      updatePlayer = `${res.data.playerScore[0]}/${res.data.playerScore[1]}`;
      console.log(updatePlayer);
    } else {
      updatePlayer = res.data.playerScore;
    }
    setPlayerScore(updatePlayer);

    let updateDealer = '';

    if (res.data?.dealerScore?.length === 2) {
      updateDealer = `${res.data.dealerScore[0]}/${res.data.dealerScore[1]}`;
      console.log(updateDealer);
    } else {
      updateDealer = res.data.dealerScore;
    }
    setDealerScore(updateDealer);
  };

  const restartGame = async () => {
    setWinner(false);
    setGameState(false);
  };

  const hit = async () => {
    const res = await axios({
      method: 'GET',
      url: '/api/hit',
    });

    if (res.data?.playerBusted === true) {
      setPlayerScore(`${res.data.playerScore} - BUST`);
      setWinner('Dealer Wins');
      adjustBalance(betValue, 'loss');
    } else {
      let update = '';

      if (res.data?.playerScore?.length === 2) {
        update = `${res.data.playerScore[0]}/${res.data.playerScore[1]}`;
        console.log(update);
      } else {
        update = res.data.playerScore;
      }
      setPlayerScore(update);
    }

    console.log(res.data);
  };

  const stand = async () => {
    const res = await axios({
      method: 'GET',
      url: '/api/stand',
    });

    console.log(res.data);

    if (res.data?.dealerBusted === true) {
      setDealerScore(`${res.data.dealerScore} - BUST`);
      setWinner('Player Wins');
      adjustBalance(betValue, 'win');
    } else {
      let updateDealer = '';

      if (res.data?.dealerScore?.length === 2) {
        updateDealer = `${res.data.dealerScore[0]}/${res.data.dealerScore[1]}`;
        console.log(updateDealer);
      } else {
        updateDealer = res.data.dealerScore;
      }
      setDealerScore(updateDealer);

      if (res.data?.winner === 'dealer') {
        setWinner('Dealer Wins');
        adjustBalance(betValue, 'loss');
      } else if (res.data?.winner === 'player') {
        setWinner('Player Wins');
        adjustBalance(betValue, 'win');
      } else if (res.data?.winner === 'tie') {
        setWinner('Tie');
        adjustBalance(betValue, 'tie');
      }
    }
  };

  const deposit = async () => {
    navigate('/account');
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
          onClick={deposit}>
          Deposit
        </button>
        <button
          className='signout-button'
          onClick={logout}>
          Sign Out
        </button>
      </div>

      {!gameState ? (
        <div className='bet-area'>
          <Form
            noValidate
            onSubmit={handleSubmit}>
            <Form.Group
              className='mb-3'
              controlId='formBasicBet'>
              <Form.Control
                className='w-50'
                onChange={(e) => setField('betAmount', e.target.value)}
                type='number'
                placeholder='Enter bet amount'
                isInvalid={!!errors.betAmount}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.betAmount}
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              className='start-button'
              type='submit'>
              Start
            </Button>
          </Form>
        </div>
      ) : (
        <div className='game-area'>
          <div className='dealer-display'></div>
          <div className='dealer-info'>
            <h3>Dealer</h3>
            <h3>{dealerScore}</h3>
          </div>
          <div className='player-display'></div>
          <div className='player-info'>
            <h3>Player</h3>
            <h3>{playerScore}</h3>
          </div>
          {winner ? (
            <>
              <h1>{winner}</h1>
              <button onClick={restartGame}>Restart</button>
            </>
          ) : (
            <div className='buttons'>
              <button
                onClick={hit}
                className='hit-button'>
                Hit
              </button>
              <button
                onClick={stand}
                className='stand-button'>
                Stand
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Play;
