import Job from '../models/JobModel.js'

class JobController {
    constructor() {
        this.getAllJobs.bind(this);
    }

    async getAllJobs(req, res) {
        try {
            const jobs = await Job.find();
            console.log("Now accessing all jobs")
            res.json(jobs)

        } catch (err) {
            res.json({
                err
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
                job_keywords: req.body.job_keywords
            };

            const newJob = new Job(input);
            const savedJob = await newJob.save();

            console.log("New Job Created Via Controller!");
            res.json(savedJob);

        } catch (error) {
            res.json({
                error
            });
        }

    }
}

export default JobController;