const mongoose = require('mongoose');
const {Rental, validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init('mongodb://localhost:27017/');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort({ dateOut: -1 });
    res.send(rentals);
})

router.post('/', async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send("Invalid Customer");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send("No Movie like That");

    if (movie.numberInStock == 0) return res.status(400).send('Movie not in stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
            // Did that instead of just using the Customer object found earlier, because the Customer object might have other properties that I don't want to store in the rentals model
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    });

    let task = Fawn.Task();

    task.save('rentals', rental)
        .update('movies', {_id: movie._id}, {$inc: {numberInStock: -1}})
        .run()
        .then(function(){
            res.send(rental);
        })
        .catch(function(err){
            res.status(500).send("Something Failed");
            console.log(err);
        });

    // try{
    //     new Fawn.Task()
    //         .save('rentals', rental) // In quotes, actuall name of the rentals collection as seen in MongoDB
    //         .update('movies', {_id: movie._id}, {$inc: {numberInStock: -1}})
    //         .run();

    //     res.send(rental);
    // }
    // catch(ex){
    //     res.status(500).send('Something Failed.');
    // }
    
})

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie Not Found");
    res.send(movie);
})

router.put('/:id', async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send("Invalid Genre");

    const movie = await Movie.findByIdAndUpdate(req.params.id, 
        { 
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate, 
        }, 
        { new: true }
        );

    if (!movie) return res.status(404).send("Movie Not Found");

    res.send(movie);
})

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send("Movie Not Found");
    res.send(movie);
})

module.exports = router;