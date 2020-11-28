import express from 'express';
import EmployerController from '../controllers/EmployerController.js';
import { forwardAuthenticated, ensureAuthenticated } from '../config/auth.js'
import pkg from 'connect-ensure-login'
const {
    ensureLoggedOut,
    ensureLoggedIn
} = pkg
const router = express.Router()

//All employers
// router.get('/', new EmployerController().getAllEmployers);

//Login
router.get('/login', forwardAuthenticated, (req, res) => res.render('employerlogin'));
router.post('/login', new EmployerController().login);
//Register
router.get("/register",
    ensureLoggedOut("/dashboard"),
    (req, res) => res.render('employersregister'));
router.post("/register", new EmployerController().register);

//New Job
router.post("/post_job", ensureLoggedIn(),
    new EmployerController().postJob);

//All jobs

router.get("/myjobs", ensureLoggedIn(), new EmployerController().getJobs)

export default router;