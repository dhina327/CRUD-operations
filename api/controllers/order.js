const mongoose = require('mongoose');

const Product = require('../models/product');
const Order = require('../models/order');

exports.order_get_all = (req, res, next) => {
    Order.find()
    .populate('product')
    .exec()
    .then( docs => {
        res.status(200).json({
            count: docs.length,
            order: docs.map(docs => {
                return{
                    id: docs.id,
                    product: docs.product,
                    quantity: docs.quantity
                }
            }),
            request:{
                type: 'GET',
                url: 'https://localhost:3000/order'
            }
        })
    .catch(err => {
        res.status(400).json({
            error: err 
        })
        })
    });
};

exports.order_post = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if(!product){
            return res.status(404).json({
                message:"Product Not Found"
            })
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        })
        return order.save()
    })
    .then(result => {
        res.status(201).json({
            message: 'Order Stored',
            createdOrder: {
                product: result.product,
                quantity: result.quantity
            },
            request:{
                type: "POST",
                url: 'https://localhost:3000/order'+result.id
            }
        })
    })
    .catch(error => {
        res.status(404).json({
            message: "ProductId Not Found",
        
        })
    })
};

exports.order_delete = (req, res, next) => {
    const id = req.params.orderId
    Order.findById(id)
    .exec()
    .then(orderId => {
        if(!orderId){
            res.status(404).json({
                message:'OrderId Not Found'
            })
        }
       return Order.deleteOne({_id: id})
    })
    .then(result => {
        res.status(200).json({
            message:"SuccessFully Removed",
            request:{
                type: "delete",
                url: 'https://localhost:3000/products',
                body: { product:'String', quantity: 'Number'}
            }
        })
    })
    .catch(err =>{
        error: err
    })
};