const {addBanner, getBanner, deleteBanner} = require('../controller/bannerMangement')
const express = require('express')
const upload = require('../middlewares/upload')
const verifyToken = require('../middlewares/verifyToken')
const Router =express.Router()


Router.post('/admin/createbanner', upload.single('image'),verifyToken, addBanner)
Router.get('/getbanner', verifyToken, getBanner)
Router.delete('/deletebanner/:bannerId', verifyToken, deleteBanner)

module.exports = Router   