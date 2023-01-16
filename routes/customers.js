const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const customerSchema = new mongoose.Schema({
    isGold: Boolean,
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

// Had to add async because I'm using promises
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort({ name: 1 });
    res.send(customers);
})

router.post('/', async (req, res) => {
    const result = validateCustomers(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    let customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone,
    });
    customer = await customer.save();
    res.send(customer);
})

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer Not Found");
    res.send(customer);
})

router.put('/:id', async (req, res) => {
    const result = validateCustomers(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, { isGold: req.body.isGold, name: req.body.name, phone: req.body.phone }, { new: true });

    if (!customer) return res.status(404).send("Customer Not Found");

    res.send(customer);
})

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send("Customer Not Found");
    res.send(customer);
})

function validateCustomers(customer) {
    const schema = Joi.object({
        isGold: Joi.boolean().required(),
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(11).max(13).required(),
    });

    return schema.validate(customer);
}

module.exports = router;