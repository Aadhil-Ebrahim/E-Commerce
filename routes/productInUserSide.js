const express = require('express')

const {getAllProducts, productsById, getProductBySearch} = require ('../controller/userside/products')

const Router = express.Router()

Router.get('/products', getAllProducts)
Router.get('/product/:id', productsById)
Router.get('/productsbysearch', getProductBySearch)

module.exports = Router   