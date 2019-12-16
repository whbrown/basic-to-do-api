require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const session = require('express-session');
const passport = require('passport');

require('./config/passport');

const dbName = 'to-do-list';
mongoose
  .connect(`mongodb://localhost/${dbName}`, {
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`Connected to Mongo: ${dbName}!`);
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(
  require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    sourceMap: true,
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const taskRoutes = require('./routes/tasks');

app.use('/api', taskRoutes);

const authroutes = require('./routes/authroutes');

app.use('/api', authroutes);

module.exports = app;
