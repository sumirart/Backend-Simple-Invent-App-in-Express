const mongoose = require('mongoose');

// mongo schema for product
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productImage: { type: String, required: true }
});

// first is name we want to use internally, the convention is use uppercase starting character
// second is schema that we want to use
module.exports = mongoose.model('Product', productSchema);