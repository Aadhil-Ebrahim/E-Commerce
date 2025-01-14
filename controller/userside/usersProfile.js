const userSchema = require('../../model/userSchema')
const addressSchema = require('../../model/addressSchema')
const bcrypt = require('bcrypt')

// Handler to update profile
const updateProfile = async(req,res)=>{
    try{

        // Extract users id from request object
        const _id = req.user.userId

        // Extract username and phone number from request body
        const { username, phoneNumber} = req.body
    
        // Create a profile object containing fields to update
        const profile = ({
            username,
            phoneNumber
        })
       
        // Validate phone number if provided
        if(phoneNumber){
            const length = phoneNumber.toString().length  

            // Check if the phone number is exactly 10 digits long     
            if(length !== 10){
                return res.status(200).json({message: 'invalid phone number'})
            }
        }

        // Check if the phone number is exactly 10 digits long
        await userSchema.findByIdAndUpdate( _id, {$set: profile} )
        return res.status(200).json({message: 'profile updated'})
    }
    catch(error){

        // Handle any error and response with error
        console.error('error in update Profile',error);
        return res.status(500).json({ error: 'error in update profile'})
    }  
   
}

// Handler to add address
const addAddress = async(req, res)=>{
    try{
        // Extract user id from request object
    const userId = req.user.userId

    // Extract address details from request body
    const { phoneNumber, address, pincode, city, state } = req.body

    // Return error response if all fields is not provided
    if(!phoneNumber || !address || !pincode ||!city || !state){
        return res.status(400).json({ message: 'all fields are required'})
    }

    // Find existing users address with users id
    const existingUserAddress = await addressSchema.findOne({userId})

    // Check if users address exist and update
    if(existingUserAddress){
         await addressSchema.findByIdAndUpdate( existingUserAddress._id, { $set: { phoneNumber, address, pincode, city, state}},  {new: true})
            return res.status(200).json({message: 'profile updated'})   
       }
    
    // Create new schema
    const Address = addressSchema({
        userId,
        address,
        pincode,
        city,
        state,
        phoneNumber
    })

    // Validate phone number if provided
    if(phoneNumber){
        const length = phoneNumber.toString().length        
        if(length !== 10){
            return res.status(400).json({message: 'invalid phone number'})
        }
    }  
    const newAddress = addressSchema(Address)

    //save address in the database
    await newAddress.save()

    // Return the success response
    return res.status(200).json({message: 'profile updatedd'})
    
    }
    catch(error){
        // Handle any error 
        console.error('error in add address',error);
        res.status(500).json('error in add address')
    }
}

//Handller to get profile
const getProfile = async(req, res)=>{
    try{
        
        //Extract user from request object
        const userId = req.user.userId

        //Find user address and details
        const address  = await addressSchema.findOne({userId}).populate({path: 'userId', select: '-_id -isBlock -role -password'})
        res.status(200).json({address})

    }
    catch(error){
        console.error('error in get profile',error);
        res.status(500).json({ error: 'error in get profile'})
    }
}

//Handler to change password
const changedPassword = async(req,res)=>{
    try{

        // Extract user ID from request object
        const _id = req.user.userId

        // Find the user by ID 
        const user = await userSchema.findOne({_id})
        
        // Extract current and new passwords from the request body
        const { currentPassword, newPassword} = req.body

        // Compare the current password with the stored hash
        const compare = await bcrypt.compare( currentPassword, user.password)

        if(compare){
            // Check if the new password meets the minimum length requirement
            if(newPassword.length < 8){
                return res.status(400).json({ message: 'password should be min 8 length'})
            }

            // Hash the new password and save it to the database
            const hashPassword = await bcrypt.hash( newPassword, 10)          
            user.password = hashPassword
            await user.save()

            //Return the success response
            return res.status(200).json({message: 'users password is changed'})
        }
        else{
            //Return an error if current password does not match
            return res.status(400).json({ message: 'current password is wrong'})
        }
    }
    catch(error){

        //Handle any error
        console.error('error in change password',error);
        return res.json({error:'error in change password'})
    }
}

//Handller to logout user
const logout = async(req,res)=>{
   
        const _id = req.user.userId 
        await userSchema.findByIdAndUpdate(_id, { $inc: { tokenVersion: 1 } })
        res.status(200).json({ message: "Logged out successfully" });
    
    
}


module.exports = {updateProfile, changedPassword, addAddress, logout, getProfile}