import Local from 'passport-local'
import bcrypt from 'bcryptjs'
const LocalStrategy = Local.Strategy

// Load User model
import Employer from '../models/EmployerModel.js'
import Jobseeker from '../models/JobSeekerModel.js'
export default function (passport) {
  passport.use(
    new LocalStrategy({
      usernameField: 'email'
    }, async (email, password, done) => {
      // Match user
      const user = await Employer.findOne({
        company_email: email
      }) 
      || await Jobseeker.findOne({
        user_email: email
      });

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
    
      
      await Jobseeker.findById(id, (err, user) => {
        done(err, user);
        if (err)
          throw err;
      });
    
    await Employer.findById(id, (err, user) => {
      done(err, user);
      if (err)
        throw err;
    });


  });
};