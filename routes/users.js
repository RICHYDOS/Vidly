const auth = require("../middleware/auth");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const { User, validate } = require('../models/user');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

// Route to get a particular user. We did not use "/:id" because a client
// could easily send the id of an=other user to view their details, instead
// At this endpoint we will get the user id from their jsonwebtoken
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});

router.post('/', async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exists");

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    // Normally, to avoid sending the password back to the user, we can manually type this in 'res.send()'
    // res.send({
    //name: user.name,
    //email: user.email, 
    // });
    // But if there are many more properties, in order to avoid this repetitiveness, one can use lodash

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

});

module.exports = router;