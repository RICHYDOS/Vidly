const Joi = require('joi');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const express = require('express');
const app = express();

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log("Connected to MongoDb..."))
    .catch(err => console.error("Could not connect to MongoDb", err));
    
app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port ${port}`));