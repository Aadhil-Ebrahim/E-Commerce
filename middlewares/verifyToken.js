const jwt = require('jsonwebtoken')
const userSchema = require('../model/userSchema')

//Function to verify token
async function verifyToken(req,res,next){

    const authHeader = req.header('Authorization');
    const token = authHeader.split(' ')[1]

    if(!token){
        return res.status(404).send('token not found')
    }

    jwt.verify(token, process.env.JWT_SECRET, async(err, user)=>{
        if(err){
            return res.status(400).send('token expired')
        }

        const findUser = await userSchema.findById(user.userId)
        console.log(findUser);
        
        if(!findUser){
            return res.status(404).json({ message: 'user not found'})
        }

        if(user.version !== findUser.tokenVersion){
            return res.json({message:' token is invalid'})
        }


        req.user = user
        next()
    })
}   

module.exports = verifyToken