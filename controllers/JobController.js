import Job from "../models/JobModel.js";
import UserController from "./UserController.js";

class JobController extends UserController {
  constructor() {
    super();
  }

  async getById(id) {
    try {
      const job = await Job.findById(id);
      return job;
    } catch (err) {
      console.error(err);
    }
  }
  async getAllJobs(req, res) {
    try {
      const jobs = await Job.find();
      console.log("Now accessing all jobs");
      res.json(jobs);
    } catch (err) {
      res.json({
        err,
      });
    }
  }

  async addJob(req, res) {
    try {
      const input = {
        company_name: req.body.company_name,
        job_title: req.body.job_title,
        job_description: req.body.job_description,
        job_requirements: req.body.job_requirements,
        job_locations: req.body.job_locations,
        job_deadline: req.body.job_deadline,
        job_type: req.body.job_type,
        job_category: req.body.job_category,
        job_keywords: req.body.job_keywords,
      };

      const newJob = new Job(input);
      const savedJob = await newJob.save();

      console.log("New Job Created Via Controller!");
      res.json(savedJob);
    } catch (error) {
      res.json({
        error,
      });
    }
  }
}

export default JobController;
