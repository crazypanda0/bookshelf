const mongoose = require('mongoose');

const order = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
    },
    book : {
        type: mongoose.Types.ObjectId,
        ref: 'books',
    },
    status: {
        type: String,
        enum: ['Order Placed', 'Shipped', 'Delivered', 'Returned'],
        default: 'Order Placed'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('order', order);