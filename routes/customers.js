const auth = require("../middleware/auth");
const mongoose = require('mongoose');
// Destruction method to make the imported functions easier to name
const {Customer, validate} = require('../models/customer');
const express = require('express');
const router = express.Router();

// Had to add async because I'm using promises
router.get('/', auth, async (req, res) => {
    const customers = await Customer.find().sort({ name: 1 });
    res.send(customers);
})

router.post('/', auth, async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    let customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone,
    });
    customer = await customer.save();
    res.send(customer);
})

router.get('/:id', auth, async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer Not Found");
    res.send(customer);
})

router.put('/:id', auth, async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, 
        {
         isGold: req.body.isGold, 
         name: req.body.name, 
         phone: req.body.phone 
        }, 
        { new: true }
    );

    if (!customer) return res.status(404).send("Customer Not Found");

    res.send(customer);
})

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send("Customer Not Found");
    res.send(customer);
});

module.exports = router;