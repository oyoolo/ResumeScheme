import express from 'express';
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const app = express();

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Set EJS as templating engine  
app.set("view engine", "ejs"); 
//Import routes
import employerRoute from './routes/Employer.js'
import jobseekerRoute from './routes/JobSeeker.js'
import jobRoute from './routes/Job.js'
import resumeRoute from './routes/Resume.js'
//Middleware for employers
app.use('/employers', employerRoute);
//Middleware for jobseekers
app.use('/jobseekers', jobseekerRoute);
//Middleware for jobs
app.use('/jobs', jobRoute);
//Middleware for resumes
app.use('/resumes', resumeRoute);
//Routes
app.get('/', (req, res) => {
    res.send("Homepage")
})

//Connect to DB
mongoose.connect(
    process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if (err)console.log(err);
        else console.log("connected to DB!");
    }
)
//Run server
app.listen(3000, () => console.log("Server Started"));
