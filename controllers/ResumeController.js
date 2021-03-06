import Resume from "../models/ResumeModel.js";
import fs from "fs";
import path from "path";

//Controls Resume Methods
export default class ResumeController {
  constructor() {}

  /**
   * All Resumes in the db
   * @param {Express.Request} req 
   * @param {Express.Response} res
   * @returns {JSON} 
   */
  async getAllResumes(req, res) {
    try {
      let resume = await Resume.findOne({});
      res.json(resume.resume_file);
    } catch (error) {
      res.json(error);
    }
  }


  /**
   * To download a resume from Mongo
   * @param {Express.Request} req 
   * @param {Express.Response} res 
   */
  async downloadResume(req, res) {
    try {
      let resume = await Resume.findOne({ resume_owner: req.params.email });
      if (resume) {
        let buffer = resume.resume_file.data.buffer;
        fs.writeFileSync("uploadedResume.pdf", buffer);
        req.flash("success_msg", "Resume Downloaded");
        res.download(`${path.resolve()}/uploadedResume.pdf`, `${resume.resume_file.metadata.originalname}`, (err) => {
          if (err) console.log(err);
        });
      } else {
        req.flash("error_msg", "Resume Unavailable");
        res.redirect(req.get("referer"));
      }
    } catch (error) {
      res.json({ error });
     
    }
  }
}
