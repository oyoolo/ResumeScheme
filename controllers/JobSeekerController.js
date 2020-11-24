import JobSeeker from '../models/JobSeekerModel.js'
import Resume from '../models/ResumeModel.js'
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
            const jobseeker = await JobSeeker.findById(req.params.jobSeekerID);

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
                    resume_content: req.body.resume_content,
                    resume_file: {
                        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                        metadata: req.file,

                    }
                }
                const newResume = new Resume(input);
                const resume = await newResume.save();
                return resume.id;
            } else {
                console.log("Invalid file! Choose PDF")
            }

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
                const user = await JobSeeker.findOne({
                    user_email
                })


                if (user) {
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
                                    res.redirect('/users/login');
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
    
    login(req , res, next) {
        try {
            passport.authenticate('local', {
              successRedirect: '/jobdashboard',
              failureRedirect: '/jobseekers/login',
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