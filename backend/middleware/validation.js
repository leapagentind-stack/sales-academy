exports.validateStudentRegistration = (req, res, next) => {
  const {
    first_name, last_name, email, password, phone,
    current_status, school_college, city, program_interest
  } = req.body;

  if (!first_name || !last_name || !email || !password || !phone ||
      !current_status || !school_college || !city || !program_interest) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  next();
};