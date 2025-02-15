const multer = require ('multer')

// Handller to uplode images
const storage = multer.diskStorage({
    
    destination: function( req, file , cb){
        cb(null,'uploads/products/')
    },
    filename: function( req, file, cb){
        cb(null,file.originalname)
    }
})

const uploads = multer({ storage })

module.exports = uploads
  