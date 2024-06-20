const cloudinary = require('cloudinary').v2
const {CloudinaryStorage}=require("multer-storage-cloudinary")

cloudinary.config({
   cloud_name:'dc9gl8qud',
 api_key:'959818847494536',
  api_secret:'WYCJ9Oifd7QBRTJp1G9GUtXjIHU'
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'BOOKINGAPP',
      allowedformat: ["png","jpeg","jpg","webp"] , // supports promises as well
      public_id: (req, file) => 'computed-filename-using-request',
    },
  });

  module.exports={
    cloudinary,
    storage
  }