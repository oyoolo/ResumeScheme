import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import passport from 'passport';
import flash from 'connect-flash';
import session from 'express-session';
import path from 'path'
dotenv.config()

const app = express();

//Passport config
import passConfig from './config/passport.js'
passConfig(passport)

//Middlewares
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//Express session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set EJS as templating engine  
app.use(expressLayouts);
app.set("view engine", "ejs");
const __dirname = path.resolve();
app.set('views', __dirname + '/public/views');
app.use(express.static(__dirname + '/public'));


//Connect flash
app.use(flash())

// Global variables
app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash("error");
        res.locals.isEmployer = false;
        next();
    });


//Import routes
import employerRoute from './routes/Employer.js'
import jobseekerRoute from './routes/JobSeeker.js'
import jobRoute from './routes/Job.js'
import resumeRoute from './routes/Resume.js'
import userRoute from './routes/User.js'

//Middleware for routes
app.use('/employer', employerRoute);
app.use('/jobseeker', jobseekerRoute);
app.use('/jobs', jobRoute);
app.use('/resumes', resumeRoute);
app.use("/", userRoute);


//Connect to DB
mongoose.connect(
    process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (err) console.log(err);
        else console.log("connected to DB!");
    }
)

//Run server
app.listen(3000, (err) => {
    if (err) {
        console.log(err)
    } else
        console.log("Server Started")
});