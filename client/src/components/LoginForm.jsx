import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import 'bootswatch/dist/slate/bootstrap.min.css';
import useAuth from '../hooks/useAuth';
import Home from './Home';
import Play from './Play';

const LoginForm = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { auth, setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Updating form values
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

  // email validation code taken from
  // https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // form validation code refactored from
  // https://dev.to/alecgrey/controlled-forms-with-front-and-backend-validations-using-react-bootstrap-5a2
  const findFormErrors = () => {
    // console.log('inside findFormErrors');
    const { email, password } = form;
    // console.log(name, email, password, password2);
    const newErrors = {};

    // email errors
    if (!email || email === '') {
      newErrors.email = 'Email cannot be blank';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // password error
    if (!password || password === '' || password.length < 3) {
      newErrors.password = 'Password must be more than 3 characters';
    }

    // console.log(newErrors);

    return newErrors;
  };

  // onSubmit for form
  const handleSubmit = async (event) => {
    // Validating the form
    event.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const { email, password } = form;

      let user = {
        email: email,
        password: password,
      };

      try {
        const res = await axios({
          method: 'POST',
          data: user,
          withCredentials: true,
          url: '/users/login',
        });

        console.log(res.data);
        const username = res.data[1];

        user = {
          email: email,
          username: username,
        };

        setAuth({ user });

        navigate('/play', { replace: true });
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Form built with bootstrap
  return (
    <>
      <div
        className='container'
        id='form'>
        <Form
          noValidate
          onSubmit={handleSubmit}>
          <Form.Group
            className='mb-3'
            controlId='formBasicEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onChange={(e) => setField('email', e.target.value)}
              type='email'
              placeholder='Enter email'
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type='invalid'>
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            className='mb-3'
            controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={(e) => setField('password', e.target.value)}
              type='password'
              placeholder='Enter Password'
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type='invalid'>
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            className='btn btn-success'
            type='submit'>
            Login
          </Button>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;
