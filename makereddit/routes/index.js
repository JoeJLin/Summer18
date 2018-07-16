const express = require('express');
const User = require('../models/user');

const router = express.Router();


// set layout variables
router.use((req, res, next) => {
  res.locals.title = 'MakeReddit';
  res.locals.currentUserId = req.session.userId;
  next();
});

/* GET home page. */
// req = HTTP request argument to the middleware function
// res = HTTP response argument to the middleware function
// next = Callback argument to the middleware function
router.get('/', (req, res) => {
  res.render('index');
});

// Login
router.get('/login', (req, res) => {
  res.render('login');
});

// POST Login
router.post('/login', (req, res, next) => {
  // req.body is the body of the login.hbs
  // req.body.username and password must be matched with the names in the login.hbs
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    // if the user's password or username is incorrect
    if (err || !user) {
      let NextError = new Error('Username or Password incorrect');
      // 401 error is Unauthorized
      NextError.status = 401;

      return next(NextError);
    }
    /* eslint-disable-next-line no-underscore-dangle */
    req.session.userId = user._id;
    return res.redirect('/');
  });
  // console.log('logging in!');
});


// logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return next(err);
      return next();
    });
  }
  return res.redirect('/login');
});


module.exports = router;
