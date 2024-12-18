const userSchema = require('../model/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async(req,res)=>{
    try{
        //Make user to register their details
        const {username,email,password} = req.body
        const userExist = await userSchema.findOne({email})
        if(!username || !email || !password){
            return res.status(400).json ({
                message: 'all fields are required'
            })
        }
        //Check user already exist or not
        if(userExist){
            return res.status(409).json({
                message: 'user already exist'
            })
        }
        if(password.length < 8){
            return res.status(400).json({
                message: 'password must be minimum 8 length'
            })
        }
        //Hash users password 
        const hashPassword = await bcrypt.hash(password,10)

        const user = await userSchema({
            username,
            email,
            password:hashPassword
        })
        // Save users details in database
        await user.save()
        // Create JWT token
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1h'})

        return res.status(201).json({
            message: 'user registered successfully' ,
            token
        })

    }
    catch(error){
        res.status(500).json({ error: 'error in registeration'})
        console.error('error in registeration',error);
        
    }
   
}
const login = async(req,res)=>{
    try{
        // Make sure that user provided required data
        const { email, password } = req.body
        if(!email || !password) {
            return res.status(400).json({ message : 'all fields are required' })
        }

        // Check is a user exist with provide email
        const user = await userSchema.findOne({email})
        if(!user){
            return res.status(404).json({ message: 'user not found'})

        }

        // Compare password with existing password
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(407).json({ message: 'wrong password'})
        }
        // Check were the users roll is admin or not
        if( user.role === 'admin' ){
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' })
            return res.status(200).json({
                message: 'admin login successfully',
                token
            })
        }
        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        return res.status(200).json({
            message:'user login successfully', 
            token
        })
    
    }
    catch(error) {
        res.json({'error':'error in login'})
        console.error('error in login', error); 
    }
}

const forgetPassword = async(req,res)=>{
    try{
        const {email} = req.body
        const user = await userSchema.findOne({email})
         //Find the email is registerd or not
        if(!user){
            return res.status(404).json({ message: 'user not found'})
        }
        
    }
    catch(error){
        res.status(500).json({error: 'error in forgetpassword'})
        console.error('error in forgetpassword',error);
    }
   
}
 
module.exports = {register,login}