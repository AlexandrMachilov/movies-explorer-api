const express = require('express');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const { idValidation, movieValidation } = require('../middlewares/validation');

const moviesRoutes = express.Router();

moviesRoutes.get('/', getMovies);

moviesRoutes.post('/', movieValidation, express.json(), createMovie);

moviesRoutes.delete('/:id', idValidation, deleteMovie);

module.exports = moviesRoutes;
