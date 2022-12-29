const Joi = require('joi');
const express = require('express');
const router = express.Router();

genres = [
    {id: 1, name:"Action"},
    {id: 2, name:"Horror"},
    {id: 3, name:"Comedy"},
    {id: 4, name:"Drama"},
    {id: 5, name:"Romance"},
]

router.get('/', (req,res) => {
    res.send(genres)
})

router.post('/', (req, res) => {
    const result = validateGenres(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const genre = {
        id: genres.length + 1, name: req.body.name,
    }

    genres.push(genre);
    res.send(genre);
})

router.get('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("Genre Not Found");
    res.send(genre);
})

router.put('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("Genre Not Found");

    const result = validateGenres(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    genre.name = req.body.name;
    res.send(genre);
})

router.delete('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("Genre Not Found");

    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
})

function validateGenres(genre){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    })

    return schema.validate(genre);
}

module.exports = router;