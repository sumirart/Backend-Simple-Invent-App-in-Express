const express = require('express');
const router = express.Router();

// get all orders
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched!'
    });
});

// add new order
router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };

    res.status(201).json({
        message: 'Orders were created!',
        order
    });
});

// get specific order
router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

// delete order
router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted!',
        orderId: req.params.orderId
    });
});

module.exports = router;