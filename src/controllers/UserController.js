const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;

module.exports = {

    async show(req, res) {
        const { id } = req.params;

        const objectId = new ObjectId(id);

        const user = await User.findOne(
           { _id: { $eq: objectId } }
        );

        user.password = undefined;

        return res.json(user);
    }
}