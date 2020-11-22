
 export function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to continue');
    res.redirect('/users/login');
  }
  export function forwardAuthenticated  (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  }


// export default auth;