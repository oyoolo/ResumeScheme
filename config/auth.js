/**
 * If user is not logged in, redirect to login page
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * 
 */
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
/**
 * If user is authorized, send them to dasboard
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * 
 */
export function forwardAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    
    return next();
  }
  res.redirect('/dashboard');
}
