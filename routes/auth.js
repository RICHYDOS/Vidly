const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const {User} = require('../models/user');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    // Time to validate User Credentials using Email and Password

    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // Find a particular user based on email(only unique field in our DB model)
    // If the user does not exist, exit the funct
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid Email or Password");

    // If the user exists, validate the user's password. 
    // Hashed password contains our salt, so it can easily match the passwords
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid Email or Password");

    // Temporaily hardcoding the private key for testing purposes
    // Generating a token
    const token = jwt.sign({_id: user._id}, 'jwtPrivateKey');
    res.send(token);

});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
    })

    return schema.validate(req);
};

module.exports = router;