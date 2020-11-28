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

  
}