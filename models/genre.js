const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    }
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenres(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    })

    return schema.validate(genre);
};

exports.Genre = Genre;
exports.validate = validateGenres;
exports.genreSchema = genreSchema;