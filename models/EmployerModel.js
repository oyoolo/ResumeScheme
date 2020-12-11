import mongoose from "mongoose";
import Joi from "joi";
import joigoose from "joigoose";
const Joigoose = joigoose(mongoose);

//Employer properties
const joiSchema = Joi.object().keys({
  company_name: Joi.string().min(3).max(30).required(),
  password: Joi.string(),
  company_email: Joi.string().email().required(),
  company_type: Joi.string(),
  posted_jobs: Joi.array().items(Joi.string().required()),
  date: Joi.date().default(Date.now),
});
const EmployerSchema = new mongoose.Schema(Joigoose.convert(joiSchema), {
  collection: "Employers",
});

export default mongoose.model("Employer", EmployerSchema);
