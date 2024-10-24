import Category from "../models/Category.js";
import { createCategorySchema } from "../validation/category.js";
import z from "zod";

export const createCategory = async (req, res) => {
    try {
        // Validate input
        createCategorySchema.parse(req.body);
        const { name } = req.body;

        const categoryName = name.toLowerCase();

        // Check if category already exists
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp("^" + categoryName + "$", "i") } }); // Case-insensitive search
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }   

         // Check if category image is provided
         const categoryLogo = req.files.categoryLogo
         ? req.files.categoryLogo[0].path // Extract the URL of the thumbnail image
         : '';

        // Create new category
        const category = new Category({ name: categoryName, categoryLogo });
        await category.save();   // Save category to database

        res.status(201).json({ message: 'Category created successfully', category });

    } catch (err) { 
        if (err instanceof z.ZodError) {
            return res.status(422).json({ errors: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
}

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({ categories });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}