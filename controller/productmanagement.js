const productSchema = require('../model/productSchema')

//create products
createProducts = async(req,res)=>{
    try{
        const{
            name,
            description,
            price,
            category,
            stock,
            image
        }= req.body

        if(!name || !description || !price){
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
        await products.save()
        res.status(200).json({message: 'product created successfully'})
    }
    catch(error){
        res.status(500),json({error: 'error in create product'})
        console.error('error in create product',error);
        
    }
}

getallproducts = async(req,res)=>{
    const products = productSchema.find({})

    //check if product exist 
    if(!products){
       return res.status(400).json({message: 'product not found'})
    }

    //list all products 
    res.status(200).json(products)
}

module.exports = {createProducts,getallproducts}  