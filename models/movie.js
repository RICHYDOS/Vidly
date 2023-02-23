const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');

// What the Database takes in
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

        // Removes spaces surrounding the string
        trim: true,
        minlength: 1,
        maxlength: 255,
    },
    genre: {
        type: genreSchema,
        required: true
    },
    
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovies(movie) {
    // What the Client sends
    const schema = Joi.object({
        title: Joi.string().min(1).max(50).required(),

        // Expect client to send only the id of the Genre. 
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
    })

    return schema.validate(movie);
};

exports.movieSchema = movieSchema;
exports.Movie = Movie;
exports.validate = validateMovies;
