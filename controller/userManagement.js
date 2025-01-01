const userSchema = require('../model/userSchema')

//Handler to get all users
const getAllUsers = async(req,res)=>{
    try{
                //Find all user in database
        const users = await userSchema.find({}) 

        // Check if there is no user
        if(!users){
            return res.status(404).json({message: 'users not found'})
        }
        
        //Lists registered users
        res.status(200).json({ message: 'List registered users successfully',
            users
        })
    }
    catch(error){
        res.status(500).json({error: 'error in getAllUser'})
        console.error('error in getAllUser',error);
        
    }
}

//Handler to get user by id
const getUserById = async(req,res)=>{
    try{
        //Take user id through params
        const id = req.params.id

        //Find user by its id
        const user = await userSchema.findOne({_id:id})
        if(!user){
            return res.status(404).json({
                message: ' user not found '
            })
        }

        //Return user by its id
        res.status(200).json({message: 'user found successfully',
            user})
    }
    catch(error){
        console.error('error in get user by id ',error);
        res.status(500).json({message: 'error in get user by id'})
    }
}

//Handler to delete user
const deleteUser = async(req,res)=>{
    try{
        //Take user id through params
        const id = req.params.id

        //Find user by its id and delete
        const user = await userSchema.findByIdAndDelete(id)

        //Check if user is not found
        if(!user){
            return res.status(400).json({ message: 'user not found'})
        } 
        res.status(200).json({message: 'user deleted successfully'})
    }
    catch(error){
        console.error('error in delete user',error);

    }
}

//Handler to block and unblock user
const activateAndDeactivateUser = async(req,res)=>{
    try{

        //Take status from body
        const body = req.body

        //Take user id through params
        const id = req.params.id

        //Find user and update 
        const user = await userSchema.findByIdAndUpdate(id, body)

        //Check if user is not found
        if(!user){
            return res.status(400).json({ message: 'user not found'})
        }

        //response as success 
        res.status(200).json({message: 'users is status updated successfully'})

    }
    catch(error){
        res.status(500).json({error: 'error in active/deactive user'})
        console.error('error in active/deactive user',error);
        
    }
}

module.exports = { getAllUsers, getUserById, deleteUser, activateAndDeactivateUser}  