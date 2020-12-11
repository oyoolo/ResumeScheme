import express from "express";
const router = express.Router();
import JobController from "../controllers/JobController.js";

const jobController = new JobController();

//ALL JOBS
router.get("/", jobController.getAllJobs);

//SUBMIT NEW JOB
router.post("/postjob", jobController.addJob);

export default router;
