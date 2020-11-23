import Employer from '../models/EmployerModel.js'
import express from 'express';
const router = express.Router()
import EmployerController from '../controllers/EmployerController.js'
import {forwardAuthenticated} from '../config/auth.js'
const employerController = new EmployerController();

//ALL EMPLOYERS
// router.get('/', employerController.getAllEmployers);

//SUBMIT NEW EMPLOYER
// router.post("/", employerController.addEmployer);

//REGISTER
router.get("/register", forwardAuthenticated, (req, res) => res.render('employersregister'));
router.post("/register", employerController.register);


//SUBMIT NEW JOB
router.post("/:employerID/post_job", employerController.postJob);
export default router;