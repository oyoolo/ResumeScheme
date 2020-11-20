import Employer from '../models/EmployerModel.js'
import Job from '../models/JobModel.js'

class EmployerController {
    constructor() {
        this.getAllEmployers.bind(this);
        this.postJob.bind(this);
        this.addEmployer.bind(this);
    }

    async getAllEmployers(req, res) {
        try {
            const employers = await Employer.find();
            console.log("Now accessing all employees")
            res.json(employers)

        } catch (err) {
            res.json({
                message: err
            });
        }
    }

    async addEmployer(req, res) {

        try {
            const input = {
                company_name: req.body.company_name,
                company_email: req.body.company_email,
            };

            const employer = new Employer(input);
            const savedEmployer = await employer.save();
            console.log('Saved an employer')
            res.json(savedEmployer);
        } catch (error) {
            res.json({
                error
            });
        }
    }

    async postJob(req, res) {
        try {
            const employer = await Employer.findById(req.params.employerID);
            const input = {
                company_name: employer.company_name,
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

            console.log("New Job Created!");
            res.json(savedJob);

        } catch (error) {
            res.json({
                error
            });
        }

    }

}

export default EmployerController;