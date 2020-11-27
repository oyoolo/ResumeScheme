import passport from 'passport'

export default class UserController {
    constructor() {

    }

    async register(req, res) {

    }

    dashboard(req , res){
        if (req.user.company_name) {
            res.render('employerdashboard', { employer: req.user })
          }
          else {
            res.render('jobseekerdashboard', { jobseeker: req.user })
        }
          
    }

    login(req, res, next) {
        try {
            passport.authenticate('local', {
                successRedirect: '/dashboard',
                failureRedirect: '/login',
                failureFlash: true
            })(req, res, next);
            
        } catch (error) {
            console.log(error)
            res.status(400).json(error)
        }
    }
}