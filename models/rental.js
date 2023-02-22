const Joi = require('joi');
const mongoose = require('mongoose');

// What the Database takes in
const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 11,
                maxlength: 13
            },
        }),
        required: true
    },

    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 1,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            },
        }),
        required: true,
    },

    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },

    dateReturned: {
        type: Date,
    },

    rentalFee: {
        type: Numeber,
        min: 0,
    },
});

const Rental = mongoose.model("Rental", rentalSchema);

function validateRentals(rental) {
    // What the Client sends
    const schema = Joi.object({
        title: Joi.string().min(1).max(50).required(),

        // Expect client to send only the id of the Genre. 
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
    })

    return schema.validate(movie);
};

exports.Movie = Movie;
exports.validate = validateMovies;
