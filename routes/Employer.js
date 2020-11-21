import Employer from '../models/EmployerModel.js'
import express from 'express';
const router = express.Router()
import EmployerController from '../controllers/EmployerController.js'

const employerController = new EmployerController();

//ALL EMPLOYERS
router.get('/', employerController.getAllEmployers);

//SUBMIT NEW EMPLOYER
router.post("/", employerController.addEmployer);

//SUBMIT NEW JOB
router.post("/:employerID/post_job", employerController.postJob);
export default router;