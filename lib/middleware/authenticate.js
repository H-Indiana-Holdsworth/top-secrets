const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // get the value from our cookie (json web token)
    const cookie = req.cookies[process.env.COOKIE_NAME];
    // verify the jwt
    const payload = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = payload;

    next();
  } catch (error) {
    error.message = 'You must be signed in to continue';
    error.status = 401;
    next(error);
  }
};
