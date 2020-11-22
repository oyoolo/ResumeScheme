import express from 'express';
const router = express.Router()
import JobSeekerController from '../controllers/JobSeekerController.js'
const jobSeekerController = new JobSeekerController();
import multer from 'multer'

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
router.get('/', jobSeekerController.getAllJobSeekers);

//SUBMIT NEW JOBSEEKER
router.post("/", jobSeekerController.addJobSeeker);

//SUBMIT RESUME
// router.get("/:jobSeekerID/myresume", jobSeekerController.getResume);
// router.get("/:jobSeekerID/submit_resume", jobSeekerController.viewResume);
router.get("/:jobSeekerID/submit_resume", jobSeekerController.viewResume);
router.post("/:jobSeekerID/submit_resume", upload.single("resumefile"), jobSeekerController.submitResume);
//
router.get("/:jobSeekerID/download_resume", jobSeekerController.downloadResume);
export default router;