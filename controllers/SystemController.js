import Job from "../models/JobModel.js";
import Resume from "../models/ResumeModel.js";
import Jobseeker from "../models/JobSeekerModel.js";

export default class SystemController {
    //INCOMPLETE
  getPercentMatch(keywords, content) {
    return new Promise((resolve, reject) => {
      try {
        resolve(0.8);
      } catch (error) {
        reject(err);
      }
    });
  }

  getSuggestions() {}
  async suggestJobs() {
    const resumes = await Resume.find();
    const jobs = await Job.find();

    resumes.forEach(async (resume) => {
      this.suggestions = [];
      let { resume_content, resume_owner } = resume;

      jobs.forEach(async (job) => {
        let keywords = job.job_keywords;
        let percent = await this.getPercentMatch(keywords, resume_content);
        if (percent >= 0.5) {
          let suggestion = {
            company_name: job.company_name,
            company_email: job.company_email,
            id: job.id,
            job_description: job.job_description,
            job_title: job.job_title,
            job_type: job.job_type,
            job_locations: job.job_locations,
            job_requirements: job.job_requirements,
            job_percentMatched: percent,
          };
        
          ///VERY INEFFIECIENT
          let jobseeker = await Jobseeker.findOne({ user_email: resume_owner });
          let { suggestedJobs } = jobseeker;
          suggestedJobs.push(suggestion);
          await jobseeker.updateOne({}, { suggestedJobs });
          await jobseeker.save();
        }

        // let jobseeker = await Jobseeker.findOneAndUpdate({
        //     user_email: resume_owner
        // }, {
        //     suggestedJobs: this.suggestions
        // }, {
        //     useFindAndModify: false,
        //     new: true,
        //     upsert: true,
        // });

        // await jobseeker.save()
      });
    });

    return "New Suggestions Ready";
  }
}
