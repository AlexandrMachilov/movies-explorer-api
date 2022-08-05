const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const ErrorUnauthorized = require('../errors/ErrorUnauthorized');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorUnauthorized('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
    );
  } catch (error) {
    return next(new ErrorUnauthorized('Необходима авторизация'));
  }
  req.user = payload;

  return next();
};
