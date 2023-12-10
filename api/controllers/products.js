const mongoose = require('mongoose');
const Product = require('../models/product');

exports.product_get_all = (req, res, next) => {
    const id = req.params.productId;
    Product.find()
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            product: docs.map( docs => {
                return {
                    id: docs._id,
                    name: docs.name,
                    price: docs.price,
                    ProductImage: docs.ProductImage,
                    request: {
                        type: 'GET',
                        url: 'https//:localhost:3000'+docs._id
                    }
                }
            })
        }
        res.status(200).json({
            response
        })
    })
    .catch(err => {
        res.status(400).json({
            err
        })
    });

};

exports.product_post = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file
    })
    product.save().then(result => {
        res.status(200).json({result});
        console.log(`Added Successfully ${res}`)
    }).catch(err => {
        console.log(err)
        res.status(400);
    });

};

exports.product_update = (req, res, next) => {
    const id = req.params.productId;
    updateData = {};
    for(const ops of req.body){
        updateData[ops.propName] = ops.value
    }
    Product.updateOne({_id:id},{$set: updateData})
    .exec()
    .then(result => {
        res.status(200).json({result})
    }).catch(err => {
        res.status(404).json({
            message:err
        })
    })
    console.log(updateData);
};

exports.product_delete = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id:id})
    .exec()
    .then(result => {
        res.status(200).json({
            message:"Data deleted Sucessfully",
            request:{
                type: "delete",
                url: 'https://localhost:3000/products',
                body: { name:'String', price: 'Number'}
            }
        })
    })
    .catch(err => {
        res.status(404).json({
            message: err,
        })
    })
};