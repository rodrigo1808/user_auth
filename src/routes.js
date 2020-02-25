const { Router } = require('express');
const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');

const routes = Router();

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);
routes.get('/user/:id', AuthController.verifyToken, UserController.show);

module.exports = routes;