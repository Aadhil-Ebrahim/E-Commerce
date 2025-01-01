const productSchema = require('../../model/productSchema')

//Handler to get all products
const getAllProducts = async(req,res)=>{
   try{
      //Find all products in database
      const products = await productSchema.find({})

      //Check if product not found
      if(products.length == [0]){
          return res.status(404).json({ message: 'products not found'})
         }

      res.status(200).json({ message: 'all products listed successfully',
            products
      })
   }
   catch(error){
    console.error('error in get all products',error);
   }
} 

//Handler to get Products by id
const productsById = async(req,res)=>{
    try{
        //Get products id through params
        const id = req.params.id 
        
        //Find product by its id
        const product = await productSchema.findOne({_id: id})

        //Check if product not found
        if(product.length == [0]){
            return res.status(404).json({ message: 'product not found'})
        }

        //Return the finded product in responds
        return res.status(200).json({ message: 'product find successfully',
            product
        })
    } 
    catch(error){
        res.status(500).json({ message: 'error in product by id'})
        console.error('error in product by id ',error);
         
    }
    
} 

//Handler to get product by search 
const getProductBySearch = async(req,res)=>{
    try{

        //Get product name through query as name
        const {name} = req.query
        const filter = {}

        //Check if name is provided
        if(name){
            filter.name = name 
        }

        //Find products by its name
        const product = await productSchema.find(filter)

        //Check if product not found
        if(product.length == [0]){
            return res.status(404).json({ message: 'product not found'})
        }

        //Get product as response
        return res.json({message: 'successfully finded by search',
            product
        })
    }
    catch(error){
        res.status(400).json({ error: 'error in product by search'})
        console.error('error in product by search ',error);
        
    } 
} 

module.exports = {getAllProducts, productsById, getProductBySearch}