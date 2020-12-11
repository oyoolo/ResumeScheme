import Job from "../models/JobModel.js";
import Resume from "../models/ResumeModel.js";
import JobSeeker from "../models/JobSeekerModel.js";

//Handle System
export default class SystemController {
  //INCOMPLETE
  /**
   * Calculate % match
   * @param {Array} keywords from job
   * @param {String} content body of resume
   * @returns {Promise} % match
   */
  getPercentMatch(keywords, content) {
    return new Promise((resolve, reject) => {
      try {
        resolve((Math.round(Math.random() * 100) / 100).toFixed(2));
      } catch (error) {
        reject(err);
      }
    });
  }

  /**
   * Update new job recommendantions
   * 
   */
  async suggestJobs() {
    const resumes = await Resume.find();
    const jobs = await Job.find();
    let newSuggestions = new Set();
    resumes.forEach(async (resume) => {
      let { resume_content, resume_owner } = resume;

      jobs.forEach(async (job) => {
        try {
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
            newSuggestions.add(suggestion);
            let newarr = Array.from(newSuggestions);
            let sugg = await JobSeeker.findOneAndUpdate(
              { user_email: resume_owner },
              { suggestedJobs: newarr },
              { upsert: true, 
                useFindAndModify: false,      
              },
              (err, doc) => {
                if (err){
                  console.log(err);
                }
              
              }
            );
            await sugg.save()
            
          }
        } catch (error) {
          console.error(error)
        }
      });
    });

    return "New Suggestions Ready";
  }
}
