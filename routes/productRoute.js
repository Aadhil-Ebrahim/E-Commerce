const express = require('express')

const { createProducts, getAllProducts, updateProducts, deleteProduct } = require('../controller/productManagement')

const uplode = require('../middlewares/upload')
const verifyToken = require('../middlewares/verifyToken')

 
const Router = express.Router()

Router.post ('/admin/addproducts', verifyToken, uplode.array('image'), createProducts)
Router.get ('/admin/getproducts', verifyToken, getAllProducts)
Router.put ('/admin/updateproducts/:id', verifyToken, updateProducts)
Router.delete ('/admin/deleteproduct/:id', verifyToken , deleteProduct)
  
module.exports = Router   