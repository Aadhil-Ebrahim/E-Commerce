const jwt = require('jsonwebtoken')

//Function to verify token
function verifyToken(req,res,next){

    const authHeader = req.header('Authorization');
    const token = authHeader.split(' ')[1]
    // console.log(token);

    if(!token){
        return res.status(404).send('token not found')
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            return res.status(400).send('token expired')
        }
        req.user = user
        next()
    })
}   

module.exports = verifyToken