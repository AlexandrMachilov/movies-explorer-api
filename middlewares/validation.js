const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

const urlValidation = (value, helper) => {
  if (!validator.isURL(value)) {
    return helper.error('string.notURL');
  }
  return value;
};

const emailValidation = (value, helper) => {
  if (!validator.isEmail(value)) {
    return helper.error('string.notEmail');
  }
  return value;
};

const signupValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .required()
      .custom(emailValidation)
      .messages({ 'string.notEmail': 'Некорректный E-mail' }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).messages({
      'string.empty': 'Поле name не может быть пустым',
    }),
  }),
});

const signinValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .required()
      .custom(emailValidation)
      .messages({ 'string.notEmail': 'Некорректный E-mail' }),
    password: Joi.string().required(),
  }),
});

const movieValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string()
      .custom(urlValidation)
      .messages({ 'string.notURL': 'Некорректный URL' }),
    trailerLink: Joi.string()
      .custom(urlValidation)
      .messages({ 'string.notURL': 'Некорректный URL' }),
    thumbnail: Joi.string()
      .custom(urlValidation)
      .messages({ 'string.notURL': 'Некорректный URL' }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const userValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string()
      .required()
      .custom(emailValidation)
      .messages({ 'string.notEmail': 'Некорректный E-mail' }),
  }),
});

const idValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  signupValidation,
  userValidation,
  signinValidation,
  idValidation,
  movieValidation,
};
