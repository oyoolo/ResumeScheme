import Job from "../models/JobModel.js"

export default class SystemController {
    
    async suggestJobs(){
        const jobs = await Job.find()

        return jobs
    }

    async sendAplicants(){
        
    }
}