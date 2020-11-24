import express from 'express'
import passport from 'passport'
import { forwardAuthenticated, ensureAuthenticated } from '../config/auth.js'
const router = express.Router()

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome', { title: "TEST THIS" }));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {

  if (req.user.company_name) {
    res.render('employerdashboard', { employer: req.user })
  }
  else {
    res.render('jobseekerdashboard', { jobseeker: req.user })
  }
  

});
// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.post('/login', (req, res, next) => {
  try {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);

  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }

});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});
// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

export default router;