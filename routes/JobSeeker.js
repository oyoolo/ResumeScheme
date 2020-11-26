import express from 'express';
import JobSeekerController from '../controllers/JobSeekerController.js'
import multer from 'multer'
import {forwardAuthenticated, ensureAuthenticated} from '../config/auth.js'

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
let upload = multer({storage});
//ALL JOBSEEKERS
// router.get('/', jobSeekerController.getAllJobSeekers);

//SUBMIT NEW JOBSEEKER
// router.post("/", jobSeekerController.addJobSeeker);

//JOBSEEKER REGISTRATION
router.get("/register", forwardAuthenticated, (req, res) => res.render('jobsregister'));
router.post("/register", jobSeekerController.register);

//JOBSEEKER LOGIN
// router.get("/login", jobSeekerController.login);
// router.post('/login', forwardAuthenticated, (req, res) => res.render('login'));

//SUBMIT RESUME

router.get("/submit_resume", jobSeekerController.viewResume);
router.post("/submit_resume", ensureAuthenticated, upload.single("resumefile"), jobSeekerController.submitResume);
//
router.get("/download_resume", jobSeekerController.downloadResume);
export default router;