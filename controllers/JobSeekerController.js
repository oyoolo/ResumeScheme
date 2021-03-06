import JobSeeker from "../models/JobSeekerModel.js";
import Job from "../models/JobModel.js";
import Employer from "../models/EmployerModel.js";
import Resume from "../models/ResumeModel.js";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import passport from "passport";
import pkg from "pdf.js-extract";
const { PDFExtract } = pkg;
const pdfExtract = new PDFExtract();

class JobSeekerController {
  /**
   *Get all jobseeekers in db
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {NextFunction} next  middleware
   * @returns {JSON} jobseekers
   */
  async getAllJobSeekers(req, res) {
    try {
      const jobseekers = await JobSeeker.find();
      console.log("Now accessing all employees");
      res.json(jobseekers);
    } catch (err) {
      res.status(500).json({
        err,
      });
    }
  }
  /**
   *Find jobs that a user applied to
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {NextFunction} next  middleware
   * @returns {JSON} jobs
   */
  async getApplications(req, res) {
    try {
      let ids = req.user.job_applications;

      let jobs = await Job.find().where("_id").in(ids).exec();
      res.json({ jobs });
    } catch (error) {
      res.json(error);
    }
  }

  /**
   *Apply to a job
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   */
  async applyToJob(req, res) {
    try {
      const job = await Job.findById(req.params.jobID);
      const jobseeker = await JobSeeker.findById(req.user.id);
      if (job && jobseeker) {
        let { job_applicants } = job;
        let { job_applications, suggestedJobs } = jobseeker;
        const suggestion = suggestedJobs.find((j) => j.id === req.params.jobID);
        const input = {
          email: req.user.user_email,
          match: suggestion.job_percentMatched,
        };

        if (
          !job_applicants.some((applicant) => applicant.email === input.email)
        ) {
          job_applicants.push(input);
          await job.updateOne(
            {
              job_applicants,
            },
            {
              runValidators: true,
            }
          );
          job_applications.push(job.id);
          await jobseeker.updateOne({
            job_applications,
          });
          req.flash("success_msg", "Applied!");
          res.redirect("/jobseeker/viewjobs");
        } else if (
          job_applicants.some((applicant) => applicant.email === input.email)
        ) {
          req.flash("error_msg", "Already Applied!");
          res.redirect("/jobseeker/viewjobs");
        }
      } else {
        res.status(403).send("Forbidden");
      }
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  }
  /**
   * Jobseeker Login
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {} next middleware
   */
  login(req, res, next) {
    try {
      passport.authenticate("local-jobseeker", {
        successRedirect: "/dashboard",
        failureRedirect: "/jobseeker/login",
        failureFlash: true,
      })(req, res, next);
    } catch (error) {
      res.status(400).json(error);
    }
  }
  /**
   * View resume within browser
   * @ignore incomplete
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {NextFunction} next  middleware
   */
  async viewResume(req, res, next) {
    try {
      const jobseeker = req.user;
      res.render("pdf", {
        name: jobseeker.fullname,
      });
    } catch (error) {
      res.json(error);
    }
  }

  /**
   *Upload a resume to MongoDb
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {NextFunction} next  middleware
   */
  async submitResume(req, res, next) {
    try {
      let { resume_content } = req.body;
      let input = {
        resume_content,
        resume_owner: req.user.user_email,
      };

      if (req.file) {
        const __dirname = path.resolve();
        let dir = path.join(__dirname + "/uploads/" + req.file.filename);
        if (
          req.file.mimetype === "application/pdf" &&
          req.file.size <= 2000000
        ) {
          let text = await getContent(dir);
          resume_content = text;
          input = {
            resume_content,
            resume_owner: req.user.user_email,
            resume_file: {
              data: fs.readFileSync(dir),
              metadata: req.file,
            },
          };
        } else {
          req.flash("error_msg", "Choose PDF file");
        }
      }

      if (resume_content.length > 0) {
        let resume = await Resume.findOneAndUpdate(
          {
            resume_owner: req.user.user_email,
          },
          input,
          {
            useFindAndModify: false,
            new: true,
            upsert: true,
          }
        );
        await resume.save();

        let jobseeker = await JobSeeker.findOneAndUpdate(
          req.user.id,
          {
            resume_id: resume.id,
          },
          {
            useFindAndModify: false,
            new: true,
            upsert: true,
          }
        );

        await jobseeker.save();
        req.flash("success_msg", "Resume Updated!");
        res.status(204).redirect("/dashboard");
      } else {
        req.flash("error_msg", "Must Upload File or Paste");
        res.redirect("/dashboard");
      }
    } catch (error) {
      res.json(error);
    }
  }
  /**
   * New jobseeker registration
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   */
  async register(req, res) {
    try {
      const { fullname, user_email, password, password2 } = req.body;

      let errors = [];

      if (!fullname || !user_email || !password || !password2) {
        errors.push({
          msg: "Please enter all fields",
        });
      }

      if (password != password2) {
        errors.push({
          msg: "Passwords do not match",
        });
      }

      if (password.length < 3) {
        errors.push({
          msg: "Password must be at least 6 characters",
        });
      }

      if (errors.length > 0) {
        res.render("jobsregister", {
          errors,
          fullname,
          user_email,
          password,
          password2,
        });
      } else {
        const jobseeker = await JobSeeker.findOne({
          user_email,
        });

        const employer = await Employer.findOne({
          company_email: user_email,
        });

        if (jobseeker || employer) {
          if (employer) {
            errors.push({
              msg: `Email registered to ${employer.company_name}`,
            });
          }

          errors.push({
            msg: "Email already exists",
          });

          res.render("jobsregister", {
            errors,
            fullname,
            user_email,
            password,
            password2,
          });
        } else {
          const newUser = new JobSeeker({
            fullname,
            user_email,
            password,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  req.flash(
                    "success_msg",
                    "You are now registered and can log in"
                  );
                  res.redirect("/jobseeker/login");
                })
                .catch((err) => console.log(err));
            });
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * To download a resume from Mongo
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {NextFunction} next  middleware
   */
  async downloadResume(req, res) {
    try {
      let resume = await Resume.findOne();
      let buffer = resume.resume_file.data.buffer;
      fs.writeFileSync("uploadedResume.pdf", buffer);
      res.redirect("/resumes/upload");
    } catch (error) {
      res.json(error);
      console.error(error);
    }
  }
}
/**
 * Extract string for resumes
 * @param {File} file
 * @returns {Promise} text of resume
 */
function getContent(file) {
  const options = {};
  return new Promise((resolve, reject) => {
    pdfExtract.extract(file, options, (err, data) => {
      if (err) reject(err);
      else {
        let text = "";
        data.pages.forEach((page) => {
          page.content.forEach((content) => {
            text += `${content.str} \n`;
          });
        });
        resolve(text);
      }
    });
  });
}

export default JobSeekerController;
