module.exports = {
  ensureAuthenticated: (req, res, next) => {
      if (req.isAuthenticated()) return next();
      req.flash('error_msg', 'Please log in first');
      res.redirect('/auth/login');
  },
  forwardAuthenticated: (req, res, next) => {
      if (!req.isAuthenticated()) return next();
      res.redirect('/dashboard');
  }
};
