const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// import routes handler
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user')


// connect to mongoDB Database
mongoose.connect('mongodb+srv://admin:'+ process.env.MONGO_ATLAS_PW + process.env.MONGO_ATLAS_SERVER, { useNewUrlParser: true })
mongoose.Promise = global.Promise;


// use morgan for HTTP logger and body-parser for parsing req.body
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
// app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// set CORS to allow access from any server
// for "production" change the domain
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, PATCH, POST, DELETE, GET");
        return res.status(200).json({});
    }

    next();
});


// set routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);


// handling errors
app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});


module.exports = app;