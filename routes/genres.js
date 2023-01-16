const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    }
});

const Genre = mongoose.model("Genre", genreSchema);

// Had to add async because Im using promises
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort({ name: 1 });
    res.send(genres);
})

router.post('/', async (req, res) => {
    const result = validateGenres(req.body);
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

router.put('/:id', async (req, res) => {
    const result = validateGenres(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

    if (!genre) return res.status(404).send("Genre Not Found");

    res.send(genre);
})

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send("Genre Not Found");
    res.send(genre);
})

function validateGenres(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    })

    return schema.validate(genre);
}

module.exports = router;