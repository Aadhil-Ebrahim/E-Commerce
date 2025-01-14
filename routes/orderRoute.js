const{placeOrder, getOrder, createPayment} = require('../controller/userside/order')
const verifyToken = require('../middlewares/verifyToken')
const express = require('express')
const Router = express.Router()

Router.post('/order', verifyToken, placeOrder)
Router.get('/getorder', verifyToken, getOrder)
// Router.post('/create-order', verifyToken, createOrder)
Router.post('/payorder', verifyToken, createPayment)
// Router.post('/capture-order',verifyToken, captureOrder)


module.exports = Router  