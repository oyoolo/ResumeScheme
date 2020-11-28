import express from 'express'
import { forwardAuthenticated, ensureAuthenticated } from '../config/auth.js'
import UserController from '../controllers/UserController.js'

const router = express.Router()

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome', { title: "TEST THIS" }));

// Dashboard
router.get('/dashboard', ensureAuthenticated, new UserController().dashboard);

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});
// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

export default router;