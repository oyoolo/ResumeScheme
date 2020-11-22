import express from 'express'
const router = express.Router()
import {ensureAuthenticated, forwardAuthenticated} from '../config/auth.js'

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('jobdashboard', {
    user: req.user
  })
);

export default router;
