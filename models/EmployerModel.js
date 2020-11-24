import mongoose from "mongoose"
import Joi from 'joi'
import joigoose from 'joigoose';
const Joigoose = joigoose(mongoose);

const joiSchema = Joi.object().keys({
        company_name: Joi.string()
            .min(3)
            .max(30)
            .required(),

        // recruitername: Joi.string()
        //     .alphanum()
        //     .min(3)
        //     .max(30)
        //     .required(),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        repeat_password: Joi.ref('password'),
        company_email: Joi.string().email().required(),
        company_type: Joi.string(),
        posted_jobs: Joi.array().items(Joi.string().required()),
        date: Joi.date().default(Date.now),
    }
    )
const EmployerSchema = new mongoose.Schema(
    Joigoose.convert(joiSchema)
    , { collection: 'Employers' }
)

export default mongoose.model('Employer', EmployerSchema);


