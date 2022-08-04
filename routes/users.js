const express = require('express');
const { editUser, getCurrentUser } = require('../controllers/users');
const { userValidation } = require('../middlewares/validation');
const { auth } = require('../middlewares/auth');

const usersRoutes = express.Router();

usersRoutes.get('/me', auth, getCurrentUser);

usersRoutes.patch('/me', auth, userValidation, editUser);

module.exports = usersRoutes;
