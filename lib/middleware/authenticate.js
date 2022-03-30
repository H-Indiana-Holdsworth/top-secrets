const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // get the value from our cookie (json web token)
    const { session } = req.cookies;
    console.log('session', session);
    // verify the jwt
    const payload = jwt.verify(session, process.env.JWT_SECRET);
    req.user = payload;
    console.log('req.user', req.user);

    next();
  } catch (error) {
    error.message = 'You must be signed in to continue';
    error.status = 401;
    next(error);
  }
};
