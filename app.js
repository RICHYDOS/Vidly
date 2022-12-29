const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

genres = [
    {id: 1, name:"Action"},
    {id: 2, name:"Horror"},
    {id: 3, name:"Comedy"},
    {id: 4, name:"Drama"},
    {id: 5, name:"Romance"},
]

app.get('/api/genres', (req,res) => {
    res.send(genres)
})

app.post('/api/genres', (req, res) => {
    const result = validateGenres(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const genre = {
        id: genres.length + 1, name: req.body.name,
    }

    genres.push(genre);
    res.send(genre);

})

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("Genre Not Found");

    const result = validateGenres(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    genre.name = req.body.name;
    res.send(genre);
})

app.delete('/api/genres/:id', (req, res) => {
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

app.listen(3000, () => console.log("Listening on Port 3000"));