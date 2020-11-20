import express from 'express';
const router = express.Router()
import ResumeController from '../controllers/ResumeController.js'
import multer from 'multer'

//
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

//
let upload = multer({
    storage: storage
});

const resumeController = new ResumeController();

//ALL JOBS
router.get('/', resumeController.getAllResumes);

//SUBMIT NEW JOB
router.post("/", upload.single("resumefile"), resumeController.addResume);

export default router;