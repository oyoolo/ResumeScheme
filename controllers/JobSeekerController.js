import JobSeeker from '../models/jobSeekerModel.js'
import Resume from '../models/ResumeModel.js'
import path from 'path'
import fs from 'fs'
import JobSeekerModel from '../models/jobSeekerModel.js';

class JobSeekerController {
    constructor() {
        this.getAllJobSeekers.bind(this);
        this.id = "o";
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
            password: req.body.password
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

    async viewResume(req, res, next) {
        try {
            // this.jobseekerid = req.params.jobSeekerID
            const jobseeker = await JobSeeker.findById(req.params.jobSeekerID);
            req.body.id = req.params.jobSeekerID
            console.log(req.body)
            res.render("pdf", {
                name: jobseeker.fullname
            })
        console.log(this.id)
        } catch (error) {
            console.error(error)
        }

    }

    //
    async submitResume(req, res, next) {
        try {
            
            const __dirname = path.resolve();
            
            
            if (req.file.mimetype === 'application/pdf' && req.file.size <= 2000000) {
                let input = {
                    // resume_owner: fullname,
                    resume_content: req.body.resume_content,
                    resume_file: {
                        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                        metadata: req.file,

                    }
                }
                const newResume = new Resume(input);
                const resume = await newResume.save();
                
                //Add resume id to jobseeker collection
                // jobseeker = await JobSeeker.updateOne({
                //     resume_id: newResume._id
                // }, err => {
                //     console.log(err)
                // })

                // res.render("pdf")
                
                // res.redirect(`/jobseekers/:jobSeekerID/download_resume`)

            } else {
                console.log("Invalid file! Choose PDF")
            }

        } catch (error) {
            console.log(error)
            
        }
        

    }
    //To download a resume from Mongo
    async downloadResume (req, res){
        
        try {
            let resume =  await Resume.findOne()
            let buffer = resume.resume_file.data.buffer
            fs.writeFileSync('uploadedResume.pdf', buffer)
            res.redirect("/resumes/upload") 
        } catch (error) {
            console.error(error)
        }
           
    }

}

export default JobSeekerController;