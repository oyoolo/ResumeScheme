
export function ensureAuthenticated(req, res, next) {
  try {
    if (req.isAuthenticated()) {
     
      return next();
    }
    
    req.flash('error_msg', 'Please log in to continue');
    res.redirect('/login');
  } catch (error) {
    console.log(error)
  }
  
 
}

export function forwardAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    
    return next();
  }
  res.redirect('/dashboard');
}
