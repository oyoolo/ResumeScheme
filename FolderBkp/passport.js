import Local from 'passport-local'
import bcrypt from 'bcryptjs'
const LocalStrategy = Local.Strategy

// Load User model
import Employer from '../models/EmployerModel.js';
import JobSeeker from "../models/JobSeekerModel.js";



export default function (passport) {
  let isEmployer ;
  let user;
  passport.use(

    new LocalStrategy({ usernameField: 'email' },

      async (email, password, done) => {

        // Match user
        const employer = await Employer.findOne({
          company_email: email
        });
        const jobseeker = await JobSeeker.findOne({
          user_email: email
        });

        user = employer || jobseeker;
        isEmployer = false;
        if (user === employer) isEmployer = true

        if (!user) {
          //EMAIL NOT REGISTERED
          return done(null, false, {
            message: 'Invalid e-mail or password. Please try again.'
          });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            //INVALID PASSWORD
            return done(null, false, {
              message: 'Invalid e-mail or password. Please try again.'
            });
          }
        });

      })
  );


  passport.serializeUser((user, done) => {
    done(null, user.id);
  });


  passport.deserializeUser(async (id, done) => {

    if (isEmployer) {
      
      await Employer.findById(id, (err, user) => {
        console.log("Employer Session Deserialized!")
        done(err, user);
        if (err)
          throw err;
      });

    } else {
      
      await JobSeeker.findById(id, (err, user) => {
        console.log("Jobseeker Session Deserialized!")
        done(err, user);
        if (err)
          throw err;
      });

    }

  });


};