const userSchema = require('../model/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const env = require('dotenv')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const { error } = require('console')
const { link } = require('fs')

env.config()


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
        //Check were the users password should not be less than eightlength
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
        const token = jwt.sign({userId:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        )

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

//send link to reset password
const sendEmail = async (email,link)=>{
    try{

        //transport otp from created transporter
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            },
            tls:{
                rejectUnauthorized:false
            }
        })

        //Format for mail to send
        const mailOptions = {  
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset password,',
            html: `click link to reset password,link has only 10 minute validity <a href=" ${process.env.RESET_LINK}${link}">click here</a>`
        }
        await transporter.sendMail(mailOptions)
        
    }
    catch(error){

        res.status(500).json({error: 'error in sendmail'})
        console.error('error in sendmail' , error);
        
    }

  
}

// Generate random string 
const generateString = crypto.randomBytes(16).toString('hex')

// 
const forgetPassword = async(req,res)=>{
    try{
        const {email} = req.body

        // Check were email is entered or not
        if(!email){
            return res.status(404).json({ message: 'mailId is required'})
        }
        const user = await userSchema.findOne({email})

        //Find the email is registerd or not
        if(!user){
            return res.status(404).json({ message: 'user not found'})
        }
        const token = generateString 

        //Save generated token to the database
        user.resetToken = token

        //Create 10 min valdity to password reset link
        user.resetTokenExpires = Date.now() + 10 * 60 * 1000

        //Save token and its validity to database 
        await user.save()

        //Invoke the function to send otp mail
        await sendEmail(email,token)
        res.status(200).json({ message:'otp is send to your email'})
    }
    catch(error){
        res.status(500).json({ error: 'error in forgetpassword'})
        console.error('error in forgetpassword',error);
    }
   
}

const resetpassword = async(req,res)=>{
    try{
        const { newpassword }= req.body

        //Find user token from the database
         const user = await userSchema.findOne({ 
            resetToken: req.params.token,
            resetTokenExpires: { $gt: Date.now() }
         })

         //Check were token is valid or not
         if(!user){
            return res.status(400).json({ message: 'Token expired'})
         }
         //Check if user provide newpassword
        if(!newpassword){
            return res.status(400).json({ message: 'newpassword are required'})
        }


         //Hash the users new password
         const hashpassword = await bcrypt.hash( newpassword, 10)
         user.password = hashpassword

         //clear the genrated token 
         user.resetToken = undefined

         //clear its tokens validity
         user.resetTokenExpires = undefined

         //Save changes to the database
         user.save()  
         res.status(200).json({ message: 'password is changed'})

    }
    catch(error){
        res.status(500).json({ error: 'error in resetpassword'})
        console.error('error in resetpassword',error);
    }
}

 
module.exports = {register,login,forgetPassword,resetpassword}