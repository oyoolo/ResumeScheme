import mongoose from "mongoose";
import Joi from "joi";
import joigoose from "joigoose";
const Joigoose = joigoose(mongoose);

//Job properties
const joiSchema = Joi.object().keys({
  company_name: Joi.string().required(),
  company_email: Joi.string().email().required(),
  job_title: Joi.string().required(),
  job_description: Joi.string().required(),
  job_requirements: Joi.string().required(),
  job_locations: Joi.string().required(),
  job_deadline: Joi.date(),
  job_type: Joi.string().required(),
  job_category: Joi.string().required(),
  job_keywords: Joi.array().items(Joi.string().required()),
  job_applicants: Joi.array(),
});
const JobSchema = new mongoose.Schema(Joigoose.convert(joiSchema), {
  collection: "Jobs",
});

export default mongoose.model("Job", JobSchema);
