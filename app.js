const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

require('./config/passport')(passport);

const app = express();
app.use(cors());

// atlas setup
const db = require('./config/keys').MongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

// Middleware for express session
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  })
);

// Middleware for passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware for body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware for routing
// app.use('/', require('./routes/index'));
app.use(express.static(path.resolve(__dirname, './client/build')));
app.use('/users', require('./routes/users'));
app.use('/api', require('./routes/api'));

const port = process.env.PORT || 5000;
app.listen(port, console.log('server started on port', port));
