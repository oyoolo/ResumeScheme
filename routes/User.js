import express from 'express'
const router = express.Router()
import bcrypt from 'bcryptjs'
import passport from 'passport'
import {forwardAuthenticated} from '../config/auth.js'
import JobSeekerModel from '../models/jobSeekerModel.js'

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));


// Register
router.post('/register', (req, res) => {
  const {
    fullname,
    user_email,
    password,
    password2
  } = req.body;
  let errors = [];

  if (!fullname || !user_email || !password || !password2) {
    errors.push({
      msg: 'Please enter all fields'
    });
  }

  if (password != password2) {
    errors.push({
      msg: 'Passwords do not match'
    });
  }

  if (password.length < 3) {
    errors.push({
      msg: 'Password must be at least 6 characters'
    });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      fullname,
      user_email,
      password,
      password2
    });
  } else {
    JobSeekerModel.findOne({
      user_email: user_email
    }).then(user => {
      if (user) {
        errors.push({
          msg: 'Email already exists'
        });
        res.render('register', {
          errors,
          fullname,
          user_email,
          password,
          password2
        });
      } else {
        const newUser = new JobSeekerModel({
          fullname,
          user_email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err =>
                console.log(err)
              );
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  try {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);

  } catch (error) {
    console.log(error)
  }

});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

export default router;