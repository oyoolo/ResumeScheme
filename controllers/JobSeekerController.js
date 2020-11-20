import JobSeeker from '../models/jobSeekerModel.js'
import Resume from '../models/ResumeModel.js'

class JobSeekerController {
    constructor() {
        this.getAllJobSeekers.bind(this);
    }

    async getAllJobSeekers(req, res) {
        try {
            const jobseekers = await JobSeeker.find();
            console.log("Now accessing all employees")
            res.json(jobseekers)

        } catch (err) {
            res.json({
                err
            });
        }
    }

    async addJobSeeker(req, res) {
        const input = {
            fullname: req.body.fullname,
            user_email: req.body.user_email,
            birth_year: req.body.birth_year,

        };

        const jobseeker = new JobSeeker(input);

        try {
            const savedJobSeeker = await jobseeker.save();
            console.log('Saved an employer')
            res.json(savedJobSeeker);
        } catch (error) {
            res.json({
                error
            });
        }
    }

    async addResume(){
        
    }

}

export default JobSeekerController;