const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User Model
const User = require('../models/User');

router.post('/balance', function (req, res) {
  const { email } = req.body;
  // console.log('retrieving balance for', email);
  User.findOne({ email: email }).then((user) => {
    res.json(user.balance);
  });
});

router.post('/setbalance', function (req, res) {
  const { email, balance } = req.body;
  console.log('setting balance for', email, balance);
  console.log(typeof balance);

  User.findOne({ email: email }).then((user) => {
    user.balance = balance;
    user.save();
  });

  res.send('done');
});

// POST request to store register info in db
router.post('/register', (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*');
  const { name, email, password } = req.body;
  // console.log(req.body);

  // VALIDATION IS PERFORMED VIA REACT

  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.send('User already exists');
    } else {
      const newUser = new User({
        name,
        email,
        password,
        balance: 1000,
      });

      // Encrypting the password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;

          newUser
            .save()
            .then((user) => {
              res.send(['Successfully registered', newUser.name]);
            })

            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// Login post
// router.post(
//   '/login',
//   passport.authenticate('local', {
//     failureMessage: true,
//   }),
//   function (req, res) {
//     res.locals.user = req.user;
//     res.locals.auth = true;
//     res.send();
//   }
// );

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) res.send('Error');
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        // res.send('Successfully Authenticated');
        res.send(['Successfully logged in', user.name]);
        // console.log(req.user);
        // console.log(user);
      });
    }
  })(req, res, next);
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/users/login');
});

module.exports = router;
