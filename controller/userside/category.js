const productSchema = require('../../model/productSchema')

//Handler to get category
const category = async (req,res)=>{
    try{

        //Take name of category through request through
        const {category} = req.query
        const filter = {} 

        //Check if category is provided
        if(category){
            filter.category = category 
        }

        //Find the product by the filter or return all the products
        const product = await productSchema.find(filter)

        //Check if product is not found
        if(product.length == [0]){
            return res.status(404).json({ message: 'products not found in this category'})
        }
      
        //Return products with success
        return res.status(200).json({ message: 'category find successfully',
            product
        }) 
    }
    catch(error){

        // Handle any errors
        res.status(500).json({ error: 'error in category'})
        console.error('error in category',error);                                         
    }   
} 

module.exports = { category} 