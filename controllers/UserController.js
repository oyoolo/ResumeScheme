import EmployerController from './EmployerController.js'

export default class UserController {
  constructor() {}
 async dashboard(req, res) {
    if (req.user.company_name) {
      let jobs = await new EmployerController().getJobs(req, res)
      // console.log(jobs)
      res.render("employerdashboard", { employer: req.user, jobs });
    } else {
    
      res.render("jobseekerdashboard", { jobseeker: req.user, jobs: req.user.suggestedJobs });
    }
  }
}
