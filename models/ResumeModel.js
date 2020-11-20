import mongoose from "mongoose"
import Joi from 'joi'
import joigoose from 'joigoose';
const Joigoose = joigoose(mongoose);

const joiSchema = Joi.object().keys({
    resume_owner: Joi.string(),
    resume_content: Joi.string(),
    resume_file: Joi.object({
        data: Buffer,
        originalname: Joi.string()
    }).required()
})

const ResumeSchema = new mongoose.Schema(
    
    Joigoose.convert(joiSchema), {
        collection: 'Resumes'
    }
)

const ResumeModel = mongoose.model('Resume', ResumeSchema)
export default ResumeModel;