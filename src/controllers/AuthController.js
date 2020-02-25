const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;

module.exports = {

    async register(req, res) {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.sendStatus(403);
        }

        let user = await User.findOne({ email })

        if(!user) {
        
            user = await User.create({
                name,
                email,
                password
            })

            const token = jwt.sign({user}, 'secretKey')

            return res.json({ message: 'Usuário criado com sucesso.' , id: user['_id'] , token});

        } else {
            return res.sendStatus(422);
        }
    },

    async login(req, res) {
        const { email, password } = req.body;

        let user = await User.findOne({ email });

        if(user) {

            if(password !== user.password) {
                return res.sendStatus(403);
            } else {
                const token = jwt.sign({user}, 'secretKey');
                return res.json({ message: 'Login feito com sucesso.', id: user['_id'], token});
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