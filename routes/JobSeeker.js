import express from 'express';
import JobSeekerController from '../controllers/JobSeekerController.js';
import multer from 'multer';
import SystemController from "../controllers/SystemController.js";
import {
    forwardAuthenticated,
    ensureAuthenticated
} from '../config/auth.js'

const sysControl = new SystemController()
const router = express.Router()
const jobSeekerController = new JobSeekerController();

//SET UP FILE UPLOAD AND LOCAL STORAGE
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

//BUFFERED FILE TO UPLOAD
let upload = multer({
    storage
});

//All jobseeker
// router.get('/', jobSeekerController.getAllJobSeekers);

//Add job seeker (brute force
// router.post("/", jobSeekerController.addJobSeeker);

//Jobseeker registration
router.get("/register", forwardAuthenticated,
    (req, res) => res.render('jobsregister'));
router.post("/register", jobSeekerController.register);

//Jobseeker login
// router.get("/login", jobSeekerController.login);
// router.post('/login', forwardAuthenticated, (req, res) => res.render('login'));

//Submit Resume
router.get("/submit_resume",
    ensureAuthenticated,
    jobSeekerController.viewResume);

router.post("/submit_resume",
    ensureAuthenticated,
    upload.single("resumefile"),
    jobSeekerController.submitResume);

//Download Resume
router.get("/download_resume", jobSeekerController.downloadResume);

//View Jobs
router.get("/viewjobs", ensureAuthenticated,
    async (req, res) => {
        let jobs = await sysControl.suggestJobs()

        res.render("jobseekerdashboard",
            {
                jobseeker: req.user,
                jobs
            })

    })

//Apply to Job
// router.get('/apply/:jobID', ensureAuthenticated, (req, res) => res.redirect("/jobseeker/viewjobs"))
router.get("/apply/:jobID", ensureAuthenticated, jobSeekerController.applyToJob)


export default router;