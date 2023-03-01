const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mongoose = require('mongoose');
const {Genre, validate} = require('../models/genre');
const express = require('express');
const router = express.Router();

// Had to add async because Im using promises
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort({ name: 1 });
    res.send(genres);
})

router.post('/', auth, async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });
    genre = await genre.save();
    res.send(genre);
})

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre Not Found");
    res.send(genre);
})

router.put('/:id', auth, async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

    if (!genre) return res.status(404).send("Genre Not Found");

    res.send(genre);
})

// Middleware functions are executed in sequential order
router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send("Genre Not Found");
    res.send(genre);
})

module.exports = router;