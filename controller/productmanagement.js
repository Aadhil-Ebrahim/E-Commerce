const productSchema = require('../model/productSchema')
const fs = require('fs')

//Handller to create products
const createProducts = async(req,res)=>{
    try{
        
        //Take all required fields from the body
        const{
            name,
            description,
            price,
            category,
            stock,
            image
        } = req.body

        //Make sure that admin provided required data
        if( !name || !description || !price || !category || !stock ){
           return res.status(400).json({message: 'fields are required'})
        }

        const products = await productSchema({
            name,
            description,
            price,  
            category,
            stock,
            image
        })

        //Check if image is not provided
        if(req.files[0]==null){
        return res.status(400).json({message:'image required'})
        }

        //Save given files path if provided
        if(req.files){
            let path = []
            req.files.forEach((files)=>{path.push(files.path)})
            products.image = path 
        }

        //Save given product details to the database
        await products.save()
        res.status(200).json({message: 'product created successfully',
            products
        })
    }
    catch(error){
        res.status(500).json({error: 'error in create product'})
        console.error('error in create product',error);
        
    }
}

//Handller to get all products
const getAllProducts = async(req,res)=>{
    try{
         //Take required data from query
    const{category} = req.query   
    const filter = {}
    if(category){
        filter.category = category
    }
    const products = await productSchema.find(filter)   

    //Check if product exist  
    if(products[0] == null){
       return res.status(400).json({message: 'product not found'})  
    } 

    //List all products 
    res.status(200).json(products)
    }
    catch(error){
        res.status(500).json({error: 'error in getallproduct'})
        console.error('error in getallproduct',error);
    }
   
}

//Handler to update products details
const updateProducts = async(req,res)=>{
    try{

        //Take id to find products
        const id = req.params.id

        //Take required updated fields
        const updatedProducts = req.body
        
        //Find product by its id and update directly
        const products = await productSchema.findByIdAndUpdate( id, updatedProducts)

        // Check if product not found
        if(!products){
            return res.status(404).json({message: 'product not found'})
        }

        // 
        res.status(200).json({ message: 'product updated succesfully', 
            updatedProducts
        }) 
    }
    catch(error){
        console.error('error in update products',error);
        
    }
}

//Handler to delete products
const deleteProduct = async(req,res)=>{
    try{

        //Take id through params
        const id = req.params.id

        //Find product by id and delete
        const product = await productSchema.findByIdAndDelete(id)

        //Check if product not found
        if(!product){
           return res.status(404).json({message: 'product not found'})
        }

        
        res.status(200).json({message: 'product deleted succesfully'})
    }
    catch(error){
        res.status(500).json({error: 'error in delete product'})
        console.error('error in delete product', error);      
    }
} 

module.exports = {createProducts,getAllProducts,updateProducts,deleteProduct}  