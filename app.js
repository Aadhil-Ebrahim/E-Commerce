const env = require('dotenv')
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

const DB = require('./config/connectDB')
const Authentication = require('./routes/AuthRoute')
const productManagement = require('./routes/productRoute')
const userManagement = require('./routes/userManagementRoute')
const couponManagement = require('./routes/couponManagementRoute')
const orderManagement = require('./routes/orderManagement')
const bannerMangement = require('./routes/bannerManagement')
const productInUserSide = require('./routes/productInUserSide')
const categoryInUserSide = require('./routes/categoryInUserSide')
const wishlistInUserSide = require('./routes/wishlistInUserSide')
const cartInUserSide = require('./routes/cartInUserSide')
const profileInUserSide = require('./routes/userProfileRoute')
const orderInUserSide = require('./routes/orderRoute')

DB()
env.config()
app.use(express.json())
app.use(cookieParser())

app.use(Authentication)
app.use(productManagement)
app.use(userManagement)
app.use(couponManagement)
app.use(orderManagement)
app.use(bannerMangement)
app.use(productInUserSide)
app.use(categoryInUserSide)
app.use(wishlistInUserSide)
app.use(cartInUserSide)
app.use(profileInUserSide)
app.use(orderInUserSide)
 
const port = process.env.PORT

app.listen( port, ()=>{
    console.log('server running'); 
})

