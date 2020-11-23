import Employer from '../models/EmployerModel.js'
import Job from '../models/JobModel.js'

class EmployerController {
    constructor() {
       
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
                company_id: req.params.employerID,
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

    async register(req, res) {
        try {
            const {
                company_name,
                company_email,
                password,
                password2
            } = req.body;

            let errors = [];

            if (!company_name || !company_email || !password || !password2) {
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
                res.render('employersregister', {
                    errors,
                    company_name,
                    company_email,
                    password,
                    password2
                });
            } else {
                const user = await Employer.findOne({
                    company_email
                })


                if (user) {
                    errors.push({
                        msg: 'Email already exists'
                    });
                    res.render('employersregister', {
                        errors,
                        company_name,
                        company_email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new Employer({
                        company_name,
                        company_email,
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
              successRedirect: '/employerdashboard',
              failureRedirect: '/Employers/login',
              failureFlash: true
            })(req, res, next);
        
          } catch (error) {
            console.log(error)
          }
    }

}

export default EmployerController;