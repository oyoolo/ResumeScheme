
import express from 'express';
const router = express.Router()
import JobSeekerController from '../controllers/JobSeekerController.js'

const jobSeekerController = new JobSeekerController();

//ALL JOBSEEKERS
router.get('/', jobSeekerController.getAllJobSeekers);

//SUBMIT NEW JOBSEEKER
router.post("/", jobSeekerController.addJobSeeker);

export default router;