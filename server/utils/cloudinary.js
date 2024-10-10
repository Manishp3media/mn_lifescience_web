import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from 'dotenv';
import Product from "../models/Product.js";
import Category from "../models/Category.js";

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
            res.status(200).json({ message: "Product deleted successfully", id: id });
        } else {
            console.log(`Product with ID ${id} not found in the database during deletion.`);
            res.status(404).json({ message: "Product not found during deletion" });
        }
    } catch (err) {
        console.error(`Error deleting product:`, err);
        res.status(500).json({ error: err.message });
    }
};

// Edit Product
export const editProduct = async (req, res) => {
    try {
        const { id, name, description, category, composition, use, sku } = req.body;

        // Check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if SKU is provided and validate
        if (sku && sku !== product.sku) {
            const existingProduct = await Product.findOne({ sku, _id: { $ne: id } });
            if (existingProduct) {
                return res.status(400).json({ message: "SKU already exists" });
            }
            product.sku = sku; // Update SKU if different from current value
        }

        // Check if category ID is provided and validate
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({ message: "Category not found" });
            }
            product.category = category;
        }

        // Handle product image update (if provided)
        if (req.files && req.files["productImage"]) {
            const newImage = req.files["productImage"][0].path;

            // If the product already has an image, delete the old one from Cloudinary
            if (product.productImage) {
                const urlParts = product.productImage.split('/');
                const folderAndFile = urlParts.slice(-2).join('/');
                const publicId = folderAndFile.split('.')[0]; // Remove file extension

                try {
                    const deletionResult = await cloudinary.v2.uploader.destroy(publicId);
                    if (deletionResult.result === 'ok') {
                        console.log(`Previous image deleted successfully from Cloudinary.`);
                    } else if (deletionResult.result === 'not found') {
                        console.log(`Previous image not found in Cloudinary. It may have been deleted already.`);
                    } else {
                        console.error(`Unexpected result from Cloudinary deletion:`, deletionResult);
                    }
                } catch (cloudinaryError) {
                    console.error(`Error deleting old image from Cloudinary:`, cloudinaryError);
                }
            }

            // Update product image with the new image path
            product.productImage = newImage;
        }

        // Update product fields only if the provided value is different from the current one
        if (name && name !== product.name) product.name = name;
        if (description && description !== product.description) product.description = description;
        if (composition && composition !== product.composition) product.composition = composition;
        if (use && use !== product.use) product.use = use;

        // Save the updated product
        await product.save();

         // Populate the category name before sending the response
         await product.populate('category', 'name');

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}
