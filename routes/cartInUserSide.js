const {addToCart, removeCart, viewCart, quantity, couponApply} = require('../controller/userside/cart')

const verifyToken = require('../middlewares/verifyToken')

const express = require('express')
const Router = express.Router()

Router.post('/addtocart/:productId', verifyToken, addToCart)
Router.get('/cart',verifyToken, viewCart)
Router.delete('/removecart/:productId',verifyToken, removeCart)
Router.put('/cart/quantity/:productId', verifyToken, quantity)
Router.put('/cart/applycoupon/:productId', verifyToken, couponApply)

module.exports = Router     