import express from 'express';
import EmployerController from '../controllers/EmployerController.js';
import pkg from 'connect-ensure-login'
const {
    ensureLoggedOut,
    ensureLoggedIn
} = pkg
const router = express.Router()
const employerController = new EmployerController();

//All employers
// router.get('/', employerController.getAllEmployers);

//Register
router.get("/register",
    ensureLoggedOut("/dashboard"),
    (req, res) => res.render('employersregister'));
router.post("/register", employerController.register);

//New Job
router.post("/post_job", ensureLoggedIn(),
    employerController.postJob);

//All jobs

router.get("/myjobs", ensureLoggedIn(), employerController.getJobs)

export default router;