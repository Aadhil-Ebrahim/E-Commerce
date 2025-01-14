const bannerSchema = require('../model/bannerScheme')

// Handler to create banner
const addBanner = async(req, res)=>{
 
    try{
        
        // Extract title ans description
        const { title, description} = req.body
        const path = req.file.path
        
        // Create banner to create 
        const banner = bannerSchema({
            title,
            description,
            image : path
        })
    
    // Save the created banner to database
    await banner.save() 

    // Return a success response
    res.status(200).json({message:'banner created succesfully'})
    }
    catch(error){
        // Handle any errors
        res.status(500).json({error:'Error in createbanners'});
        console.error('error in add banner', error);  
    }
}

// Handler to get banner
const getBanner = async(req,res)=>{
    try{

        // find all banner from the database
        const banner = await bannerSchema.find({})

        // Check if banner not found 
        if(!banner){
            return res.status(404).send('banner not found')
        }
        res.status(200).json({banner})
        
    }
   catch(error){
    // 
    console.error(error);   
    res.status(500).json({error:'Error i get all banners'});

   }
}

const deleteBanner = async(req,res)=>{
    try{
        const _id = req.params.bannerId
        await bannerSchema.findByIdAndDelete(_id)
        res.status(200).send('delete successfully')
    }
    catch(error){
        console.error(error);
        res.status(500).json({error :'error in delete banner'})
        
    }
 
}
module.exports = {addBanner, getBanner, deleteBanner}    
