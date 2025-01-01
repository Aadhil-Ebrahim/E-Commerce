const wishlistSchema = require('../../model/wishlistSchema')
const userSchema = require('../../model/userSchema')
const productSchema = require('../../model/productSchema')

const { default: mongoose } = require('mongoose')

//Handler to add products to wishlist
const addWishlist = async(req,res)=>{
    try{
        //Take products id through route parameter
        const productId = req.params.productId

        //Get user id from request object
        const userId = req.user.userId
        
        //Find user by id
        const user = await userSchema.findById(userId)

        //Find product by id
        const product = await productSchema.findById(productId)
       
        
        const wishlist = wishlistSchema({
            userId: user,    
            products: product
        })
        
        //Find user from wishlist
        const wishList = await wishlistSchema.findOne({userId})   

        //Check if user already exist for this user
        if(wishList){
            
            //Check if product already exist in users wishlist
            if(wishList.products.includes(productId)){ 
                return res.status(400).json({ message: 'product is alredy added in wishlist'})
            }
            
            //If not add product to wishlist
            wishList.products.push(product)
            await wishlistSchema.findByIdAndUpdate(wishList,{products: wishList.products})
    
            //Response with success
            return res.status(200).json({ message: 'product added to wishlist successfully',
                products: wishList
            })
        }
    
        // If no existing wishlist is found, save the new wishlist
        await wishlist.save()

         //Response with success
        res.status(200).json({message: 'wishlist added successfully'}) 
    }
    catch(error){
        //Handle errors and send error response
        res.status(500).json({error: 'error in add to wishlist '})
        console.error('error in add to wishlist', error);
        
    }
}

//Handler to get wish list
const getWishList = async(req,res)=>{
    try{

        //Take user id through request object
        const user = req.user.userId
        
        //Aggregation to fetch users wishlist
        const wishlist = await wishlistSchema.aggregate([

        //Match the users id in wishlist collection
        {$match: { userId: new mongoose.Types.ObjectId(user)}},

        //Lookup the products collection to get product details based on the product id in the wishlist
        {
        $lookup: {  
            from: 'products',
            localField: 'products',
            foreignField: '_id',
            as: 'wishList'
        }},

        //Unwind the wishlist array to destructure
        {$unwind: '$wishList'}, 

        //Project the specific detail as needed
        {
            $project:{
                name: '$wishList.name',
                price: '$wishList.price',
                stock: '$wishList.stock',
                image: '$wishList.image'
            }
        } 
    ])

    // Check if wishlist is empty
    if(wishlist.length == [0]){
        return res.status(400).json({ message: 'no products are added to the wishlist'})
    }
    
    //Response with success
    res.status(200).json({ message: 'successfully listed wishlist',wishlist})
    
    }
    catch(error){

        //Handle errors and send error response
        res.status(500).json({ error: 'error in get wishlist '})
        console.error('error in get wishlist', error);      
    }
    
 
}

//Handler to removelist
const removeWishlist = async(req,res)=>{

    //Take user through request object
    const userId = req.user.userId
        
    //Take product through route parameter
    const product = req.params.productId
    
    await wishlistSchema.updateOne({userId: userId}, {$pull: {products: product}})
    //Send success response
    res.json({ message: ' wishlist removed successfully '})

}

module.exports = {addWishlist, getWishList, removeWishlist } 
   