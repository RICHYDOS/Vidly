const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    phone: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 13,
    },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomers(customer) {
    const schema = Joi.object({
        isGold: Joi.boolean(),
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(11).max(13).required(),
    });

    return schema.validate(customer);
};

exports.customerSchema = customerSchema;
exports.Customer = Customer;
exports.validate = validateCustomers;