import Local from 'passport-local'
import bcrypt from 'bcryptjs'
const LocalStrategy = Local.Strategy

// Load User model
import Employer from '../models/EmployerModel.js';
import JobSeeker from "../models/JobSeekerModel.js";

export function jobseekerConfig (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' },
      async (email, password, done) => {

        const jobseeker = await JobSeeker.findOne({
          user_email: email
        });

        if (!jobseeker) {
          
          //EMAIL NOT REGISTERED
          return done(null, false, {
            message: 'Invalid e-mail or password. Please try again.'
          });
        }

        // Match password
        bcrypt.compare(password, jobseeker.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, jobseeker);
          } else {
            //INVALID PASSWORD
            return done(null, false, {
              message: 'Invalid e-mail or password. Please try again.'
            });
          }
        });

      })
  );


  passport.serializeUser((jobseeker, done) => {
    done(null, jobseeker.id);
  });

  passport.deserializeUser(async (id, done) => {

      await JobSeeker.findById(id, (err, user) => {
        console.log("Jobseeker Session Deserialized!")
        done(err, user);
        if (err)
          throw err;
      });

 

  });


};

export function employerConfig (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' },
      async (email, password, done) => {
        // Match user
        const employer = await Employer.findOne({
          company_email: email
        });
        
        if (!employer) {
          //EMAIL NOT REGISTERED
          return done(null, false, {
            message: 'Invalid e-mail or password. Please try again.'
          });
        }

        // Match password
        bcrypt.compare(password, employer.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, employer);
          } else {
            //INVALID PASSWORD
            return done(null, false, {
              message: 'Invalid e-mail or password. Please try again.'
            });
          }
        });

      })
  );

  passport.serializeUser((employer, done) => {
    done(null, employer.id);
  });

  passport.deserializeUser(async (id, done) => {
      await Employer.findById(id, (err, user) => {
        console.log("Employer Session Deserialized!")
        done(err, user);
        if (err)
          throw err;
      });
  });
};