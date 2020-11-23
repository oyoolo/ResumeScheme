import mongoose from "mongoose"
import Joi from 'joi'
import joigoose from 'joigoose';
const Joigoose = joigoose(mongoose);

const joiSchema = Joi.object().keys({
        fullname: Joi.string()
            .min(3)
            .max(30)
            .required(),

        birth_year: Joi.number()
            .integer()
            .min(1900)
            .max(2004),

        password: Joi.string(),
        // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        resume: Joi.object(),
        user_email: Joi.string().email().required(),
        phone: Joi.number().integer(),
        date: Joi.date().default(Date.now),
    }

)
const JobSeekerSchema = new mongoose.Schema(
    Joigoose.convert(joiSchema), {
        collection: 'JobSeekers'
    }
)
const JobSeekerModel = mongoose.model('JobSeekers', JobSeekerSchema)
export default JobSeekerModel;