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
});

// Delete an entire product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body; // Get product ID from the request body

        // Find the product by ID and delete it
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Optionally, you can delete images from Cloudinary if they are stored there
        if (product.productImages.length > 0) {
            // Iterate through productImages and delete each image from Cloudinary
            for (const image of product.productImages) {
                if (image.url) { // Check if the URL exists
                    const urlParts = image.url.split('/'); // Access the `url` property correctly
                    const folderAndFile = urlParts.slice(-2).join('/');
                    const publicId = folderAndFile.split('.')[0]; // Remove file extension

                    try {
                        await cloudinary.v2.uploader.destroy(publicId);
                        console.log(`Deleted image with public ID: ${publicId} from Cloudinary.`);
                    } catch (cloudinaryError) {
                        console.error(`Failed to delete image with public ID: ${publicId} from Cloudinary.`);
                    }
                }
            }
        }

        console.log(`Product with ID ${id} deleted successfully.`);
        res.status(200).json({ message: "Product deleted successfully", productId: id });
    } catch (err) {
        console.error(`Error deleting product:`, err);
        res.status(500).json({ error: err.message });
    }
};


// Delete a specific image from a product
export const deleteProductImage = async (req, res) => {
    try {
        const { id, imageId } = req.body; // id for the product and imageId for the specific image to delete

        // Find the product in the database
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find the index of the image to delete
        const imageIndex = product.productImages.findIndex(image => image._id.equals(imageId)); // Use .equals() for ObjectId comparison

        if (imageIndex === -1) {
            return res.status(404).json({ message: "Image not found in the product" });
        }

        const imageToDelete = product.productImages[imageIndex];
        console.log(`Product image URL: ${imageToDelete.url}`); // Assuming each image has a `url` property

        // Delete image from Cloudinary if it exists
        if (imageToDelete.url) {
            // Extract the public ID including the folder name
            const urlParts = imageToDelete.url.split('/');
            const folderAndFile = urlParts.slice(-2).join('/'); // Get the last two parts (folder and file)
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
                return res.status(500).json({ message: "Failed to delete image from Cloudinary", error: cloudinaryError.message });
            }
        }

        // Remove the image from the productImages array
        product.productImages.splice(imageIndex, 1);

        // Save the updated product
        await product.save();

        console.log(`Image with ID ${imageId} deleted successfully from product ${id}.`);
        res.status(200).json({ message: "Image deleted successfully", imageId: imageId });
    } catch (err) {
        console.error(`Error deleting product image:`, err);
        res.status(500).json({ error: err.message });
    }
};



// Edit Product
export const editProduct = async (req, res) => {
    try {
        const { id, name, description, category, composition, use, sku, tags } = req.body;

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

        // // Handle product image update (if provided)
        // if (req.files && req.files["productImages"]) {
        //     const newImage = req.files["productImage"][0].path;

        //     // If the product already has an image, delete the old one from Cloudinary
        //     if (product.productImage) {
        //         const urlParts = product.productImage.split('/');
        //         const folderAndFile = urlParts.slice(-2).join('/');
        //         const publicId = folderAndFile.split('.')[0]; // Remove file extension

        //         try {
        //             const deletionResult = await cloudinary.v2.uploader.destroy(publicId);
        //             if (deletionResult.result === 'ok') {
        //                 console.log(`Previous image deleted successfully from Cloudinary.`);
        //             } else if (deletionResult.result === 'not found') {
        //                 console.log(`Previous image not found in Cloudinary. It may have been deleted already.`);
        //             } else {
        //                 console.error(`Unexpected result from Cloudinary deletion:`, deletionResult);
        //             }
        //         } catch (cloudinaryError) {
        //             console.error(`Error deleting old image from Cloudinary:`, cloudinaryError);
        //         }
        //     }

        //     // Update product image with the new image path
        //     product.productImage = newImage;
        // }

        // Update product fields only if the provided value is different from the current one
        if (name && name !== product.name) product.name = name;
        if (description && description !== product.description) product.description = description;
        if (composition && composition !== product.composition) product.composition = composition;
        if (use && use !== product.use) product.use = use;
        if (tags && tags !== product.tags) product.tags = tags;

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

