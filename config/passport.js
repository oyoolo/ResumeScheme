import Local from "passport-local";
import bcrypt from "bcryptjs";
const LocalStrategy = Local.Strategy;

// Load User model
import Employer from "../models/EmployerModel.js";
import JobSeeker from "../models/JobSeekerModel.js";

//Creates a session user

class SessionConstructor {
  constructor(userId, userType) {
    this.userId = userId;
    this.userType = userType;
  }
}

/**
 * Comfigure passport auth
 * @param {import('passport').PassportStatic} passport
 */
export default function (passport) {
  passport.use(
    "local-employer",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        const employer = await Employer.findOne({
          company_email: email,
        });
        validate(password, employer, done);
      }
    )
  );

  passport.use(
    "local-jobseeker",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        const jobseeker = await JobSeeker.findOne({
          user_email: email,
        });

        validate(password, jobseeker, done);
      }
    )
  );

  passport.serializeUser((user, done) => {
    let userType = "unassigned";
    let userPrototype = Object.getPrototypeOf(user);
    if (userPrototype === JobSeeker.prototype) {
      userType = "jobseeker";
    } else if (userPrototype === Employer.prototype) {
      userType = "employer";
    }
    let sessionConstructor = new SessionConstructor(user.id, userType);
    done(null, sessionConstructor);
  });

  passport.deserializeUser(async (sessionConstructor, done) => {
    if (sessionConstructor.userType === "employer") {
      await Employer.findById(
        sessionConstructor.userId,
        "-localStrategy.password",
        (err, user) => {
          done(err, user);
          if (err) throw err;
        }
      );
    } else if (sessionConstructor.userType === "jobseeker") {
      await JobSeeker.findById(
        sessionConstructor.userId,
        "-localStrategy.password",
        (err, user) => {
          done(err, user);
          if (err) throw err;
        }
      );
    }
  });
}

/**
 * Validate user password
 * @param {String} password
 * @param {import('mongoose').Model} user
 *
 */
function validate(password, user, done) {
  if (!user) {
    return done(null, false, {
      message: "Invalid e-mail or password. Please try again.",
    });
  }

  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) throw err;
    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false, {
        message: "Invalid e-mail or password. Please try again.",
      });
    }
  });
}
