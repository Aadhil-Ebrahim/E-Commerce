const env = require('dotenv')
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

const DB = require('./config/connectDB')
const Authentication = require('./routes/AuthRoute')
const productManagement = require('./routes/productRoute')
const userManagement = require('./routes/userManagementRoute')
const productInUserSide = require('./routes/productInUserSide')
const categoryInUserSide = require('./routes/categoryInUserSide')
const wishlistInUserSide = require('./routes/wishlistInUserSide')


DB()
env.config()
app.use(express.json())
app.use(cookieParser())

 

app.use(Authentication)
app.use(productManagement)
app.use(userManagement)
app.use(productInUserSide)
app.use(categoryInUserSide)
app.use (wishlistInUserSide)
 
const port = process.env.PORT

app.listen(port, ()=>{
    console.log('server running'); 
})

