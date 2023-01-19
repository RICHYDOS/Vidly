const Joi = require('joi');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const express = require('express');
const app = express();

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log("Connected to MongoDb..."))
    .catch(err => console.error("Could not connect to MongoDb", err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port ${port}`));