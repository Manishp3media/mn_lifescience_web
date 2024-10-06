import { createProductSchema } from "../validation/product.js";
import { z } from "zod";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import mongoose from 'mongoose';

// Create Product
export const createProduct = async (req, res) => {
    try {
        // Validate input
        createProductSchema.parse(req.body);
        const { name, description, category: categoryName, composition, use, sku  } = req.body;

            // Check if SKU already exists
        const existingProduct = await Product.findOne({ sku });
        if (existingProduct) {
            return res.status(400).json({ message: "SKU already exists" });
        }

           // Find category by name (assuming category is passed as a name)
           const category = await Category.findOne({ name: categoryName.toLowerCase() });
           if (!category) {
               return res.status(404).json({ message: "Category not found" });
           }   

        // Check if image is provided
        let productImage;
        if (req.files && req.files["productImage"]) {
            productImage = req.files["productImage"][0].path;
        }
           
        // Create new product
        const product = new Product({
            name,
            description,
            category: category._id,
            composition,
            use,
            sku,
            productImage
        });

        // Save product to database
        await product.save();

        res.status(201).json({ message: "Product created successfully" });
    } catch (err) { 
        console.error(err); //
        if (err instanceof z.ZodError) {
            return res.status(422).json({ errors: err.errors });    
        }
        res.status(500).json({ error: err.message });
    }
}

// Get All Products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "categories", // The name of the Category collection
                    localField: "category", // Field from the Product schema
                    foreignField: "_id", // Field from the Category schema
                    as: "categoryDetails" // Output array field
                }
            },
            {
                $unwind: { // Unwind to get category details in a single object instead of an array
                    path: "$categoryDetails",
                    preserveNullAndEmptyArrays: true // Keeps products without categories
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    composition: 1,
                    use: 1,
                    sku: 1,
                    status: 1,
                    productImage: 1,
                    "category": "$categoryDetails.name" // Include only the name of the category
                }
            }
        ]);

        res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Products By Category
export const getProductsByCategory = async (req, res) => {
    try {
        const { category: categoryName } = req.params;

        // Find the category by name
        const category = await Category.findOne({ name: categoryName.toLowerCase() });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Fetch products that belong to the found category
        const products = await Product.find({ category: category._id });

        res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Product By ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("category");
        res.status(200).json({ product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

