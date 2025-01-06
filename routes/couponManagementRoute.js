const {createCoupon, updateCoupon, deleteCoupon, viewCoupons} = require('../controller/couponManagement')
const verifyToken = require ('../middlewares/verifyToken')

const express = require('express')

const Router = express.Router()

Router.post('/admin/createcoupon',verifyToken, createCoupon)
Router.put('/admin/updatecoupon/:id', verifyToken, updateCoupon)
Router.delete('/admin/deletecoupon/:id', verifyToken, deleteCoupon)
Router.get('/admin/coupons', verifyToken, viewCoupons)

module.exports = Router
