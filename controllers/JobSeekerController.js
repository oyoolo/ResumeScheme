import JobSeeker from '../models/jobSeekerModel.js'
import Resume from '../models/ResumeModel.js'
import path from 'path'
import JobSeekerModel from '../models/jobSeekerModel.js';


class JobSeekerClass {
    constructor(id) {
        this.Id = id
    }

    get id() {
        return this.Id
    }

    set id(newid) {
        this.Id = newid
    }
}
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

    async viewResume(req, res) {
        try {
            // this.jobseekerid = req.params.jobSeekerID
            const jobseeker = await JobSeeker.findById(req.params.jobSeekerID);
            let jobID = req.params.jobSeekerID
            this.Seeker.id(jobID)
            console.log("VIEW" + this.Seeker.id() + jobseeker)
            res.render("pdf", {
                name: jobseeker.fullname
            })
        } catch (error) {
            console.error(error)
        }
    }

    //
    async submitResume(req, res) {

        try {
            const jobseeker = await JobSeeker.findById(this.jobseekerid, (err, res) => {
                console.log(err)
            });

            // console.log(req)
            let __dirname = path.resolve();

            if (req.file.mimetype === 'application/pdf' && req.file.size <= 2000000) {
                let input = {
                    resume_owner: jobseeker.fullname,
                    resume_owner_id: req.params.jobSeekerID,
                    resume_content: req.body.resume_content,
                    resume_file: {
                        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                        metadata: req.file,

                    }
                }
                const newResume = new Resume(input);
                await newResume.save();

                //Add resume id to jobseeker collection
                jobseeker = await JobSeeker.updateOne({
                    resume_id: newResume._id
                }, err => {
                    console.log(err)
                })

                res.send()
                // res.redirect(`/${jobSeekerID}/submit_resume"`)

            } else {
                console.log("Invalid file! Choose PDF")
            }

        } catch (error) {
            console.log(error)
            res.json({
                error
            })
        }

    }

}

export default JobSeekerController;