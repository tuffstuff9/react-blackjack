import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import 'bootswatch/dist/slate/bootstrap.min.css';

const RegisterForm = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
    const { name, email, password, password2 } = form;
    // console.log(name, email, password, password2);
    const newErrors = {};
    // name errors
    if (!name || name === '') {
      newErrors.name = 'Name cannot be blank';
    } else if (name.length > 30) {
      newErrors.name = 'Name is too long';
    } else if (name.length < 3) {
      // console.log('test');
      newErrors.name = 'Name needs to be more than 3 characters';
    }

    // email errors
    if (!email || email === '') {
      newErrors.email = 'Email cannot be blank';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // password errors
    if (!password || password === '') {
      newErrors.password = 'Password cannot be blank';
    } else if (password.length < 3) {
      newErrors.password = 'Password must be more than 3 characters';
    }

    if (!password2 || password2 === '') {
      newErrors.password2 = 'Password cannot be blank';
    } else if (password2.length < 3) {
      newErrors.password2 = 'Password must be more than 3 characters';
    }

    if (password !== password2) {
      newErrors.password = 'Passwords must match';
      newErrors.password2 = 'Passwords must match';
    }

    // console.log(newErrors);

    return newErrors;
  };

  // onSubmit for form
  const handleSubmit = (event) => {
    // console.log('handling submit');
    // Validating the form
    event.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // console.log('errors');
    } else {
      const { name, email, password, password2 } = form;
      // console.log('no errors');
      const newUser = {
        name: name,
        email: email,
        password: password,
        password2: password2,
      };

      // Sending a POST request with form data in req.body
      // axios
      //   .post('http://localhost:3000/users/register', newUser)
      //   .then((response) => console.log(response.data));
      axios
        .post('/users/register', newUser)
        .then((response) => console.log(response.data));

      navigate('/login', { replace: true });
      // Redirect to login with success message
    }
  };

  // Form built with bootstrap
  return (
    <div
      className='container'
      id='form'>
      <Form
        noValidate
        onSubmit={handleSubmit}>
        <Form.Group
          className='mb-3'
          controlId='formBasicName'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            onChange={(e) => setField('name', e.target.value)}
            placeholder='Enter name'
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type='invalid'>
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

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
            placeholder='Create Password'
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type='invalid'>
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group
          className='mb-3'
          controlId='formBasicPassword2'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            onChange={(e) => setField('password2', e.target.value)}
            type='password'
            placeholder='Confirm Password'
            isInvalid={!!errors.password2}
          />
          <Form.Control.Feedback type='invalid'>
            {errors.password2}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          className='btn btn-info'
          type='submit'>
          Register
        </Button>
      </Form>
    </div>
  );
};

export default RegisterForm;
