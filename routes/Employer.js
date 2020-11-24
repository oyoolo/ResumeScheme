import express from 'express';
import EmployerController from '../controllers/EmployerController.js'
import { ensureAuthenticated } from '../config/auth.js'
import pkg from 'connect-ensure-login'
const { ensureLoggedOut } = pkg
const router = express.Router()
const employerController = new EmployerController();

//ALL EMPLOYERS
// router.get('/', employerController.getAllEmployers);

//SUBMIT NEW EMPLOYER
// router.post("/", employerController.addEmployer);

//REGISTER
router.get("/register",
    ensureLoggedOut("/dashboard"),
    (req, res) => res.render('employersregister'));
router.post("/register", employerController.register);

//DASHBOARD
// router.get('/', ensureAuthenticated, (req, res) => {
//     res.render('employerdashboard', {
//         user: req.user
//     })
// });

//SUBMIT NEW JOB
router.post("/:employerID/post_job", employerController.postJob);
export default router;