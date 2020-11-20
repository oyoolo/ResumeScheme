import Resume from '../models/ResumeModel.js'
import fs from 'fs'
import path from 'path'


export default class ResumeController {

    constructor() {

    }

    async getAllResumes(req, res) {
        try {
            let resumes = await Resume.find()
            console.log("Finding Resumes")
            // res.json(resumes)
            res.render('pdf', {
                items: resumes
            })
        } catch (error) {
            res.json(error)
        }
        // Resume.find({}, (err, items) => { 
        //     if (err) { 
        //         console.log(err); 
        //     } 
        //     else { 
        //         res.render('pdf', { items: items }); 
        //     } 
        // }); 
    }

    async addResume(req, res) {

        try {
            let __dirname = path.resolve();
            let input = {
                resume_owner: req.body.resume_owner,
                resume_content: req.body.resume_content,
                resume_file: {
                    data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                }
            }
            const newResume = new Resume(input);
            console.log(input)
            await newResume.save();
            res.redirect('/resumes');

    } catch (error) {
        console.log(error)
        res.json({
            error
        })
    }



}


}