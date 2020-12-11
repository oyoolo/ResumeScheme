import express from "express";
import JobSeekerController from "../controllers/JobSeekerController.js";
import multer from "multer";
import { forwardAuthenticated, ensureAuthenticated } from "../config/auth.js";

const router = express.Router();
const jobSeekerController = new JobSeekerController();

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
let upload = multer({
  storage,
});

//All jobseeker
router.get("/", jobSeekerController.getAllJobSeekers);

//Add job seeker (brute force)
// router.post("/", jobSeekerController.addJobSeeker);

//Login
router.get("/login", forwardAuthenticated, (req, res) =>
  res.render("jobseekerlogin")
);
router.post("/login", jobSeekerController.login);
//Jobseeker registration
router.get("/register", forwardAuthenticated, (req, res) =>
  res.render("jobsregister")
);
router.post("/register", jobSeekerController.register);

// //Submit Resume
// router.get(
//   "/submit_resume",
//   ensureAuthenticated,
//   jobSeekerController.viewResume
// );
//Submit Resume
router.post(
  "/submit_resume",
  ensureAuthenticated,
  upload.single("resumefile"),
  jobSeekerController.submitResume
);

//Download Resume
router.get("/download_resume", jobSeekerController.downloadResume);

//View Jobs
router.get("/viewjobs", ensureAuthenticated, async (req, res) => {
  res.render("jobseekerdashboard", {
    jobseeker: req.user,
    jobs: req.user.suggestedJobs,
  });
});

//Apply to Job
router.get(
  "/apply/:jobID",
  ensureAuthenticated,
  jobSeekerController.applyToJob
);

//View My Applications
router.get(
  "/myapplications",
  ensureAuthenticated,
  jobSeekerController.getApplications
);

export default router;
