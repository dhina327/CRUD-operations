const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const orderController = require('../controllers/order');
const order = require('../models/order');

router.get('/', orderController.order_get_all);
           
router.post('/', orderController.order_post);

router.delete('/:orderId', orderController.order_delete);



module.exports = router;