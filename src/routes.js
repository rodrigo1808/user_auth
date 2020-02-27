const { Router } = require('express');
const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');

const { check } = require('express-validator');


const routes = Router();

routes.post('/register', [ check('email').isEmail(), check('password').isLength({ min: 5 }) ], AuthController.register);
routes.post('/login', [ check('email').isEmail(), check('password').isLength({ min: 5 }) ], AuthController.login);
routes.get('/user/:id', AuthController.verifyToken, UserController.show);

module.exports = routes;