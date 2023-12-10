const express = require('express');
const app = express();
const morgon = require('morgan');
const mongoose = require('mongoose');

const bodyParse = require('body-parser');

const db_url = 'mongodb://localhost:27017';
mongoose.connect(db_url);
const conn = mongoose.connection;
conn.once('open',() => {
    console.log('connect sucessfully');
});
conn.once('err',() => {
    console.log('error on the database');
})

mongoose.Promise = global.Promise;
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/users');

app.use(morgon('dev'));
app.use(bodyParse.urlencoded({extended: false}));
app.use(bodyParse.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Orgin','*');
    res.header('Access-Control-Allow-Headers','Orgin, Accept, Connected-type, Authorization');
    if(res.method === 'OPTION'){
        res.header('Access-Control-Allow-Methods','PUT, POST, DELETE, PATCH, GET');
        return res.status(200).json({});
    };
    next();
})

app.use('/user', userRoutes);
app.use('/products', productRoutes);
app.use('/order', orderRoutes);
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    })
})
module.exports = app;