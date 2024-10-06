import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from 'dotenv';
import Product from "../models/Product.js";

dotenv.config(); 

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
        folder: "catalagoue-products", // Folder name in Cloudinary
        allowed_formats: ["jpg", "png", "jpeg", "webp"], // Allowed formats
    },
});

export const upload = multer({ 
    storage,
    limits: {
        fileSize: 1024 * 1024 * 4, // MB
    },
 });


 // Delete Product
 export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;

        // Find the product in the database
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log(`Product image URL: ${product.productImage}`);

        // Delete image from Cloudinary if it exists
        if (product.productImage) {
            // Extract the public ID including the folder name
            const urlParts = product.productImage.split('/');
            const folderAndFile = urlParts.slice(-2).join('/');
            const publicId = folderAndFile.split('.')[0]; // Remove file extension
            console.log(`Attempting to delete image with public ID: ${publicId}`);

            try {
                const deletionResult = await cloudinary.v2.uploader.destroy(publicId);
                console.log(`Cloudinary deletion result:`, deletionResult);

                if (deletionResult.result === 'ok') {
                    console.log(`Image deleted successfully from Cloudinary.`);
                } else if (deletionResult.result === 'not found') {
                    console.log(`Image not found in Cloudinary. It may have been deleted already.`);
                } else {
                    console.error(`Unexpected result from Cloudinary deletion:`, deletionResult);
                }
            } catch (cloudinaryError) {
                console.error(`Error deleting image from Cloudinary:`, cloudinaryError);
            }
        }

        // Delete product from database
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (deletedProduct) {
            console.log(`Product with ID ${id} deleted successfully from the database.`);
            res.status(200).json({ message: "Product deleted successfully" });
        } else {
            console.log(`Product with ID ${id} not found in the database during deletion.`);
            res.status(404).json({ message: "Product not found during deletion" });
        }
    } catch (err) {
        console.error(`Error deleting product:`, err);
        res.status(500).json({ error: err.message });
    }
};