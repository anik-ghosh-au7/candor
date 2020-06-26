import cloudinaryLib from 'cloudinary';
const cloudinary = cloudinaryLib.v2;

import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
});

module.exports = cloudinary;
