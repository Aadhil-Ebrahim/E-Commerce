const express = require('express')

const {category} = require('../controller/userside/category')

const Router = express.Router()

Router.get('/products/category',category)

module.exports = Router