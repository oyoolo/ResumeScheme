import JobSeeker from '../models/JobSeekerModel.js'
import Job from '../models/JobModel.js'
import Employer from '../models/EmployerModel.js'
import Resume from '../models/ResumeModel.js'
import bcrypt from 'bcryptjs'
import path from 'path'
import fs from 'fs'

class JobSeekerController {
    constructor() {
        this.getAllJobSeekers.bind(this);
        this.id = "o";
    }

    //
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

    async applyToJob(req, res) {
        try {

            const job = await Job.findById(req.params.jobID)
            let { job_applicants } = job;

            if (!job_applicants.includes(req.user.user_email) || job_applicants.length === 0) {
                
                job_applicants.push(req.user.user_email)
                console.log(job_applicants)
                await job.updateOne({ job_applicants }, { runValidators: true })
                

                const jobseeker = await JobSeeker.findById(req.user.id)
                let { job_applications } = jobseeker;
                // console.log(job_applications)
                job_applications.push(job.id)
                await jobseeker.updateOne({ job_applications })
                req.flash(
                    'success_msg',
                    'Applied!'
                );

                console.log("Applied!");
                res.redirect("/jobseeker/viewjobs")
            }
            else {
                req.flash(
                    'error_msg',
                    'Already Applied!'
                );

                console.log("Already applied")
                res.redirect("/jobseeker/viewjobs")
            }
        } catch (error) {
            console.error(error)
        }
    }

    async viewResume(req, res, next) {
        try {
            const jobseeker = req.user;
            res.render("pdf", {
                name: jobseeker.fullname
            })

        } catch (error) {
            console.error(error)
        }

    }

    //
    async submitResume(req, res, next) {
        try {
            let { resume_content } = req.body;
            let input = { resume_content, resume_owner: req.user.user_email };
            if (req.file) {
                const __dirname = path.resolve();
                if (req.file.mimetype === 'application/pdf' && req.file.size <= 2000000) {
                    input = {
                        resume_content,
                        resume_owner: req.user.user_email,
                        resume_file: {
                            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                            metadata: req.file,

                        }
                    }

                } else {
                    req.flash(
                        'error_msg',
                        'Choose PDF file'
                    );
                    console.log("Invalid file! Choose PDF")
                }
            }

            let resume = await Resume.findOneAndUpdate(
                { resume_owner: req.user.user_email },
                input,
                {
                    useFindAndModify: false,
                    new: true,
                    upsert: true
                })
            await resume.save()

            let jobseeker = await JobSeeker.findOneAndUpdate(
                req.user.id,
                { resume_id: resume.id },
                {
                    useFindAndModify: false,
                    new: true,
                    upsert: true
                })

            await jobseeker.save()

            console.log("Resume Uploaded!")
            req.flash(
                'success_msg',
                'Resume Updated!'
            );

            res.status(204).redirect("/dashboard")


        } catch (error) {
            console.log(error)

        }

    }

    async register(req, res) {

        try {
            const {
                fullname,
                user_email,
                password,
                password2
            } = req.body;

            let errors = [];

            if (!fullname || !user_email || !password || !password2) {
                errors.push({
                    msg: 'Please enter all fields'
                });
            }

            if (password != password2) {
                errors.push({
                    msg: 'Passwords do not match'
                });
            }

            if (password.length < 3) {
                errors.push({
                    msg: 'Password must be at least 6 characters'
                });
            }

            if (errors.length > 0) {
                res.render('jobsregister', {
                    errors,
                    fullname,
                    user_email,
                    password,
                    password2
                });
            } else {
                const jobseeker = await JobSeeker.findOne({
                    user_email
                })

                const employer = await Employer.findOne({
                    company_email: user_email
                })

                if (jobseeker || employer) {
                    if (employer) {
                        errors.push({
                            msg: `Email registered to ${employer.company_name}`
                        });
                    }

                    errors.push({
                        msg: 'Email already exists'
                    });

                    res.render('jobsregister', {
                        errors,
                        fullname,
                        user_email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new JobSeeker({
                        fullname,
                        user_email,
                        password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    req.flash(
                                        'success_msg',
                                        'You are now registered and can log in'
                                    );
                                    res.redirect('/login');
                                })
                                .catch(err =>
                                    console.log(err)
                                );
                        });
                    });
                }

            }
        } catch (error) {
            console.error(error)
        }
    }

    login(req, res, next) {
        try {
            passport.authenticate('local', {
                successRedirect: '/jobdashboard',
                failureRedirect: '/login',
                failureFlash: true
            })(req, res, next);

        } catch (error) {
            console.log(error)
        }
    }

    //To download a resume from Mongo
    async downloadResume(req, res) {

        try {
            let resume = await Resume.findOne()
            let buffer = resume.resume_file.data.buffer
            fs.writeFileSync('uploadedResume.pdf', buffer)
            res.redirect("/resumes/upload")
        } catch (error) {
            console.error(error)
        }

    }

}

export default JobSeekerController;