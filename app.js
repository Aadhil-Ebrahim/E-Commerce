const env = require('dotenv')
const express = require('express')
const app = express()

const DB = require('./config/connectDB')
const Authentication = require('./routes/AuthRoute')

DB()
env.config()
app.use(express.json())

app.use(Authentication)

const port = process.env.PORT

app.listen(port, ()=>{
    console.log('server running'); 
})

