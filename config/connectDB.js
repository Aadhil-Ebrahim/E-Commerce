const mongoose = require('mongoose')
const env = require('dotenv')
env.config()


async function connectDB () {
    try{
        await mongoose.connect(process.env.DATABASE_STRING)
        console.log('database connected');
        
    }
    catch(error){
        console.error('error in database connection',error);
        
    }
}

module.exports = connectDB