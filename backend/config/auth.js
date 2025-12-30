require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  cookieExpire: process.env.COOKIE_EXPIRE || 30 * 24 * 60 * 60 * 1000
};