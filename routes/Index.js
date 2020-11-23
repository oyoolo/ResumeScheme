import express from 'express'
const router = express.Router()
import {ensureAuthenticated, forwardAuthenticated} from '../config/auth.js'

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome', {title : "TEST THIS"}));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>{
  console.log(req.user)
  res.render('jobdashboard', {
    user: req.user
  })
}
 
);

export default router;
