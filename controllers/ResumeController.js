import Resume from "../models/ResumeModel.js";
import fs from "fs";
import path from "path";

//Controls Resume Methods
export default class ResumeController {
  constructor() {
    this.getAllResumes.bind(this);
    this.addResume.bind(this);
  }

  //All / One Resume In MongoDB
  async getAllResumes(req, res) {
    try {
      let resume = await Resume.findOne({});
      console.log("Finding Resumes");
      res.json(resume.resume_file);
    } catch (error) {
      res.json(error);
    }
  }

  //Upload files onto MongoDb
  async addResume(req, res) {
    try {
      let __dirname = path.resolve();

      if (req.file.mimetype === "application/pdf" && req.file.size <= 2000000) {
        // let input = {
        //   resume_owner: req.body.resume_owner,
        //   resume_content: req.body.resume_content,
        //   resume_file: {
        //     data: fs.readFileSync(
        //       path.join(__dirname + "/uploads/" + req.file.filename)
        //     ),
        //     metadata: req.file,
        //   },
        // };
        // const newResume = new Resume(input);
        // console.log(req.file);
        // await newResume.save();
        // res.redirect("/resumes");

        
      } else {
        console.log("Invalid file! Choose PDF");
      }
    } catch (error) {
      console.log(error);
      res.json({
        error,
      });
    }
  }

  //To download a resume from Mongo
  async downloadResume(req, res) {
    try {
      let resume = await Resume.findOne();
      let buffer = resume.resume_file.data.buffer;
      fs.writeFileSync("uploadedResume.pdf", buffer);
      res.redirect("/resumes/upload");
    } catch (error) {
      console.error(error);
    }
  }
}


