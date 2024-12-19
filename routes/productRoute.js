const express = require('express')
const {createProducts,getallproducts}= require('../controller/productmanagement')
const Router = express.Router()

Router.post('/admin/products',createProducts)
Router.get('/admin/products',getallproducts)

module.exports = Router