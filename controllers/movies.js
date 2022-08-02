const Movie = require('../models/movie');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorForbidden = require('../errors/ErrorForbidden');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .sort({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(() => {
      throw new ErrorNotFound('Фильм не найден');
    })
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        throw new ErrorForbidden('Можно удалять только свои фильмы');
      }
      return Movie.findByIdAndRemove(req.params.id)
        .orFail(() => {
          throw new ErrorNotFound('Фильм с данным id не найден');
        })
        .then(() => {
          res.send(movie);
        });
    })
    .catch(next);
};
