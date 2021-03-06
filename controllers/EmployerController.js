import Employer from "../models/EmployerModel.js";
import JobSeeker from "../models/JobSeekerModel.js";
import Job from "../models/JobModel.js";
import bcrypt from "bcryptjs";
import UserController from "./UserController.js";
import passport from "passport";

class EmployerController extends UserController {
  constructor() {
    super();
  }

  /**
   * Get all jobs in db
   * @param {Express.Request} req 
   * @param {Express.Response} res 
   */
  async getJobs(req, res) {
    try {
      if (req.user.company_email) {
        let jobs = await Job.find({ company_email: req.user.company_email });
        // res.render("employerdashboard", { employer: req.user, jobs });
       
        return jobs;
        //For public use
        // res.json({ jobs })
      } else res.status(403).send("Forbidden");
    } catch (error) {
      res.json(error);
    }
  }

  //Get all employers in db
  /**
   * 
   * @param {Express.Request} req 
   * @param {Express.Response} res 
   */
  async getAllEmployers(req, res) {
    try {
      const employers = await Employer.find();
      console.log("Now accessing all employees");
      res.json(employers);
    } catch (err) {
      res.json({
        message: err,
      });
    }
  }


  /**
   * Get applicants of a job
   * @param {Express.Request} req 
   * @param {Express.Response} res
   */
  async getApplicants(req, res) {
    try {
      if (req.user.company_email) {
        let { job_applicants } = await Job.findById(req.params.jobID);

        res.json(job_applicants);
      }
      res.status(403).send("Forbidden");
    } catch (error) {
      res.json(error);
    }
  }

  /**
   * Post a new job
   * @param {Express.Request} req 
   * @param {Express.Response} res
   */
  async postJob(req, res) {
    try {
      let keywords = req.body.job_keywords;
      const job_keywords = keywords.split(",");
      const input = {
        company_name: req.user.company_name,
        company_email: req.user.company_email,
        job_title: req.body.job_title,
        job_description: req.body.job_description,
        job_requirements: req.body.job_requirements,
        job_locations: req.body.job_locations,
        job_deadline: req.body.job_deadline,
        job_type: req.body.job_type,
        job_category: req.body.job_category,
        job_keywords: job_keywords,
      };
      let errors = [];

      if (
        !input.job_title ||
        !input.job_title ||
        !input.job_category ||
        !input.job_description ||
        !input.job_requirements ||
        !input.job_locations ||
        !input.job_deadline ||
        !input.job_type ||
        !input.job_keywords
      ) {
        errors.push({
          msg: "Please enter all fields",
        });
      }

      if (errors.length > 0) {
        res.render("employerdashboard", {
          errors,
          employer: req.user,
          ...input,
        });
      } else {
        const newJob = new Job(input);
        const savedJob = await newJob.save();
        let employer = await Employer.findById(req.user.id);
        let newjobs = employer.posted_jobs.push(savedJob.id);
        await employer.updateOne(req.user.id, { posted_jobs: newjobs });
        await employer.save();
        console.log("New Job Created!");
        // res.json(savedJob);

        req.flash("success_msg", "Job Has Been Posted");
        res.status(204).redirect("/dashboard");
        // res.redirect('/dashboard');
      }
    } catch (error) {
      console.log(error);
      res.json({
        error,
      });
    }
  }

  /**
   * New Employer registration
   * @param {Express.Request} req 
   * @param {Express.Response} res
   */

  async register(req, res) {
    try {

      //Use library
      const { company_name, company_email, company_type, password , password2 } = req.body;

      let errors = [];

      if (!company_name || !company_email || !password || !password2 ||!company_type) {
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
        res.render("employersregister", {
          errors,
          company_name,
          company_email,
          company_type,
          password,
          password2,
        });
      } else {
        const jobseeker = await JobSeeker.findOne({
          user_email: company_email,
        });

        const employer = await Employer.findOne({
          company_email,
        });

        if (jobseeker || employer) {
          errors.push({
            msg: "Email already exists",
          });

          res.render("employersregister", {
            errors,
            company_name,
            company_email,
            company_type,
            password,
            password2,
          });
        } else {
          const newUser = new Employer({
            company_name,
            company_email,
            company_type,
            password,
          });

          //Update to new bcrypt
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
                  res.redirect("/login");
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
   * Log into db
   * @param {Express.Request} req 
   * @param {Express.Response} res
   * @param {NextFunction} next  middleware
   */
  login(req, res, next) {
    try {
      passport.authenticate("local-employer", {
        successRedirect: "/dashboard",
        failureRedirect: "/employer/login",
        failureFlash: true,
      })(req, res, next);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
}

export default EmployerController;
