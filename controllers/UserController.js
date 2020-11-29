export default class UserController {
  constructor() {}
  dashboard(req, res) {
    if (req.user.company_name) {
      res.render("employerdashboard", { employer: req.user });
    } else {
      res.render("jobseekerdashboard", { jobseeker: req.user });
    }
  }
}
