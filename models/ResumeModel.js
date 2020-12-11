import mongoose from "mongoose";
import Joi from "joi";
import joigoose from "joigoose";
const Joigoose = joigoose(mongoose);

// Resume properties
const joiSchema = Joi.object().keys({
  resume_owner: Joi.string(),
  resume_content: Joi.string(),
  resume_file: Joi.object({
    data: Buffer,
    metadata: Joi.object(),
  }).required(),
});

const ResumeSchema = new mongoose.Schema(Joigoose.convert(joiSchema), {
  collection: "Resumes",
});

export default mongoose.model("Resume", ResumeSchema);
