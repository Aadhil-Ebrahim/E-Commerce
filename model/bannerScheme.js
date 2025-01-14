const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: {
          type: String,
          required: true 
        },
    description: {
         type: String
         },
    image: { 
         type: String
         }
});

module.exports = mongoose.model('Banner', bannerSchema);
