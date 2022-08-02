const express = require('express');
const { editUser, getCurrentUser } = require('../controllers/users');
const { userValidation } = require('../middlewares/validation');

const usersRoutes = express.Router();

usersRoutes.get('/me', getCurrentUser);

usersRoutes.patch('/me', userValidation, editUser);

module.exports = usersRoutes;
