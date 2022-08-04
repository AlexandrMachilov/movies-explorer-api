const express = require('express');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { auth } = require('../middlewares/auth');
const { idValidation, movieValidation } = require('../middlewares/validation');

const moviesRoutes = express.Router();

moviesRoutes.get('/', auth, getMovies);

moviesRoutes.post('/', auth, movieValidation, express.json(), createMovie);

moviesRoutes.delete('/:id', auth, idValidation, deleteMovie);

module.exports = moviesRoutes;
