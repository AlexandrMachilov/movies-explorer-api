const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorConflict = require('../errors/ErrorConflict');
const ErrorUnauthorized = require('../errors/ErrorUnauthorized');
const ErrorValidation = require('../errors/ErrorVaidation');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с id ${req.params.id} не найден`);
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorConflict(`Пользователь ${email} уже существует`);
      }
      return bcrypt.hash(password, 10);
    })

    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.editUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с id ${req.user._id} не найден`);
    })
    .then((user) => {
      if (user.email) {
        throw new ErrorConflict('Пользователь c данным email уже существует');
      }
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorUnauthorized('Неправильные email или пароль');
      }
      return bcrypt.compare(password, user.password).then((isValid) => {
        if (!isValid) {
          throw new ErrorUnauthorized('Неправильные email или пароль');
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
          { expiresIn: '7d' },
        );
        res.send({ jwt: token });
      });
    })

    .catch(next);
};
