const {getAllOrders, getUserOrderById, updateOrderStatus, deleteOrder} = require('../controller/orderManagement')
const verifyToken = require('../middlewares/verifyToken')

const express = require('express')
const Router = express.Router()

Router.get('/admin/orders', verifyToken, getAllOrders)
Router.get('/admin/:orderId', verifyToken, getUserOrderById)
Router.put('/admin/status/:orderId', verifyToken, updateOrderStatus)
Router.delete('/admin/deleteorder/:orderId', verifyToken, deleteOrder)

module.exports = Router