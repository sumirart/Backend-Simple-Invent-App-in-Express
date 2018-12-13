const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

// import checkAuth for checking JWT/token
const checkAuth = require('../middleware/check-auth');

// import mongo Schema
const Product = require('../models/products');

// set multer
const storage = multer.diskStorage({
    // set destination
    destination: function(req, file, cb){
        cb(null, './uploads');
    },

    // set the filename
    filename: function(req, file, cb){
        // cb(null, new Date().toISOString() + file.filename);
        cb(null, file.fieldname + '-' + Date.now() );
    }
});

// set filter file type
const fileFilter = ( req, file, cb ) => {
    //if file is not jpg / png, reject file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(new Error('File must be JPG or PNG!'), false);
    }
}

// apply fileFilter and filter file size
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //5 MB
    },
    fileFilter: fileFilter
});

//  get all products
router.get('/', (req, res, next) => {
    // find all using find()
    Product.find()
    .select("-__v") //select other column beside __v
    .exec() //execute the query
    .then(docs => {
        // send formatted response
        const response = {
            count: docs.length,
            products: docs.map(doc => { //map through all data
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    url: 'http://localhost:3000/products/' + doc._id
                }
            })
        }
        // console.log(docs);
        res.status(200).json(response); // send formatted response
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});


// add new product
router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    // define new instance of Product
    // console.log(req.file)
    const product = new Product({
        _id: mongoose.Types.ObjectId(), //mongoose generated ID
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    // save to mongoDB
    product.save()
    .then(result => {
        // console.log(result);
        res.status(201).json({
            message: 'Success add new product!',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});


// get specific product
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    
    // find the specific ID
    Product.findById(id)
    .select("-__v") //select other column beside __v
    .exec() //executes the query
    .then(doc => {
        // send respons here
        // console.log(doc);
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: "Get all data",
                    url: "http://localhost:3000/products"
                }
            });
        } else {
            res.status(404).json({ message: "No valid entry found for provided ID!" });
        }
    })
    .catch(err => {
        //log the error and send status
        console.log(err);
        res.status(500).json({ error: err });
    })

});


// patch/update specific product
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;

    // old
    // Product.update({ _id: id }, { $set: { name: req.body.newName, price: req.body.newPrice }})

    const updateOps = {};
    // iterate req.body (if we only send one data, its mean only one)
    // example req.body.text only, so only update text
    // if we send req.body.text and req.body.price, update text and price (iterate 2 times)
    for(const ops of req.body){
        // example updateOps[text] = value
        updateOps[ops.propName] = ops.value;
    }

    // update with _id: id, and $set based on updateOps
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            // console.log(result);
            res.status(200).json({
                message: "Product updated!",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


// delete specific product
router.delete('/:productId', (req, res, next) => {
   const id = req.params.productId;
   Product.remove({ _id: id }) //remove where _id: id
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});


module.exports = router;    