const cloudinary = require('cloudinary').v2
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadToCloudinary = (filePath, petId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, {public_id: petId}, function (error, result) {
            if (error) reject(error);
            else {
                resolve(result);
            }
        });
    })
}