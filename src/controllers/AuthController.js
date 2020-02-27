const User = require('../models/User');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const saltRounds = 10;

module.exports = {

    async register(req, res) {
        const { name, email, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        if(!name) {
            return res.sendStatus(422);
        }

        let user = await User.findOne({ email })

        if(!user) {

             bcrypt.hash(password, saltRounds, async function(err, hash) {
                user = await User.create({
                    name,
                    email,
                    password: hash
                })
    
                const token = jwt.sign({user}, 'secretKey')
    
                return res.json({ message: 'Usuário criado com sucesso.' , id: user['_id'] , token});
            });

        } else {
            return res.sendStatus(422);
        }
    },

    async login(req, res) {
        const { email, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let user = await User.findOne({ email });

        if(user) {

            if(await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({user}, 'secretKey');
                return res.json({ message: 'Login feito com sucesso.', id: user['_id'], token});
            } else {
                return res.sendStatus(403);
            }

        } else {
            return res.sendStatus(403);
        }
    },

    async verifyToken(req, res, next) {
        const bearerHeader = req.headers['authorization'];

        if(bearerHeader) {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(bearerToken, 'secretKey', function(err, authData) {
                if(authData) {
                    next();
                } else {
                    return res.sendStatus(403);
                }
            });
        } else {
            return res.sendStatus(403);
        }
    }
}