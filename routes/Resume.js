import express from "express";
const router = express.Router();
import ResumeController from "../controllers/ResumeController.js";
import multer from "multer";
import {
  forwardAuthenticated,
  ensureAuthenticated
} from '../config/auth.js'

//SET UP FILE UPLOAD AND LOCAL STORAGE
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

//BUFFERED FILE TO UPLOAD
let upload = multer({ storage });

//
const resumeController = new ResumeController();

//GET ALL RESUMES
router.get("/", resumeController.getAllResumes);

//SUBMIT NEW RESUME
// router.post("/upload", upload.single("resumefile"), resumeController.addResume);
// router.get("/upload", (req, res) => {
//     res.render('pdf')
// });

//DOWNLOAD A RESUME
router.get("/:email/download", ensureAuthenticated, resumeController.downloadResume);

export default router;
