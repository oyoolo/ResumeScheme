import express from 'express';
const router = express.Router()
import JobController from '../controllers/JobController.js'

const jobController = new JobController();

//ALL JOBS
router.get('/', jobController.getAllJobs);

//SUBMIT NEW JOB
router.post("/", jobController.addJob);

export default router;