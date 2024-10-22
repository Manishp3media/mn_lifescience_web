import { createProductSchema } from "../validation/product.js";
import { z } from "zod";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import mongoose from 'mongoose';
import XLSX from "xlsx";

// Create Product
export const createProduct = async (req, res) => {
    try {
        // Validate input
        createProductSchema.parse(req.body);
        const { name, description, category: categoryName, composition, use, sku, tags  } = req.body;

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

        // Check if thumbnail image is provided
        const thumbnailImage = req.files.thumbnailImage
        ? req.files.thumbnailImage[0].path // Extract the URL of the thumbnail image
        : '';
        
        // Check if image is provided
        let productImages = [];
        if (req.files && req.files["productImages"]) {
            productImages = req.files["productImages"].map(file => ({
                _id: new mongoose.Types.ObjectId(),  // Assign MongoDB ObjectId
                url: file.path                       // Store file path or URL
            }));
        }
           
        // Create new product
        const product = new Product({
            name,
            description,
            category: category._id,
            composition,
            use,
            sku,
            tags,
            productImages,
            thumbnailImage
        });

        // Save product to database
        await product.save();

         // Populate the category name before sending the response
         await product.populate('category', 'name');

        res.status(201).json({ message: "Product created successfully", product });
    } catch (err) { 
        console.error(err); //
        if (err instanceof z.ZodError) {
            return res.status(422).json({ errors: err.errors });    
        }
        res.status(500).json({ error: err.message });
    }
}

// Controller for handling bulk product uploads via Excel
// export const bulkUploadProducts = async (req, res) => {
//     try {
//         // Check if file exists
//         if (!req.file) {
//             return res.status(400).json({ message: "No file uploaded" });
//         }

//         // Parse the Excel file from buffer (since it's stored in memory)
//         const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//          // Normalize the header names to lower case
//          const normalizedSheet = sheet.map(row => {
//             const normalizedRow = {};
//             for (const key in row) {
//                 normalizedRow[key.toLowerCase()] = row[key]; // Normalize keys to lower case
//             }
//             return normalizedRow;
//         });

//         const products = [];
//         for (const row of normalizedSheet) {
//             try {
//                 // Validate each row using Zod schema
//                 createProductSchema.parse(row);

//                 const { name, description, category: categoryName, composition, sku, tags } = row;

//                 // Check if SKU already exists
//                 const existingProduct = await Product.findOne({ sku });
//                 if (existingProduct) {
//                     console.warn(`SKU ${sku} already exists, skipping...`);
//                     continue;
//                 }

//                 // Find the category by name
//                 const category = await Category.findOne({ name: categoryName.toLowerCase() });
//                 if (!category) {
//                     console.warn(`Category ${categoryName} not found, skipping...`);
//                     continue;
//                 }

//                 // Create product object
//                 const product = new Product({
//                     name,
//                     description,
//                     category: category._id,
//                     composition,
//                     sku,
//                     tags
//                 });

//                 // Save product to database
//                 await product.save();
//                 products.push(product);  // Add saved product to the response array
//             } catch (err) {
//                 console.error(err);
//                 continue;  // Skip invalid product row
//             }
//         }

//         res.status(201).json({ message: "Bulk upload completed", products });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// };


export const bulkUploadProducts = async (req, res) => {
    console.log('Starting bulk upload process');
    const startTime = Date.now();

    try {
        // Check if file exists
        if (!req.file) {
            console.error('No file provided in request');
            return res.status(400).json({ message: "No file uploaded" });
        }

        console.log('File details:', {
            originalName: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype
        });

        // Parse the Excel file from buffer
        console.log('Starting Excel parsing');
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(`Excel parsing complete. Found ${sheet.length} rows`);

        // Normalize the header names
        console.log('Normalizing headers');
        const normalizedSheet = sheet.map(row => {
            const normalizedRow = {};
            for (const key in row) {
                normalizedRow[key.toLowerCase()] = row[key];
            }
            return normalizedRow;
        });

        const products = [];
        const errors = [];
        let processed = 0;
        let skipped = 0;

        console.log('Starting row processing');
        for (const row of normalizedSheet) {
            processed++;
            try {
                // Log progress every 10 rows
                if (processed % 10 === 0) {
                    console.log(`Processed ${processed}/${normalizedSheet.length} rows`);
                }

                // Validate row
                try {
                    createProductSchema.parse(row);
                } catch (validationError) {
                    errors.push({
                        row: processed,
                        error: 'Validation failed',
                        details: validationError.errors
                    });
                    skipped++;
                    continue;
                }

                const { name, description, category: categoryName, composition, sku, tags } = row;

                // Check SKU
                const existingProduct = await Product.findOne({ sku });
                if (existingProduct) {
                    console.log(`Duplicate SKU found: ${sku}`);
                    errors.push({
                        row: processed,
                        error: 'Duplicate SKU',
                        sku
                    });
                    skipped++;
                    continue;
                }

                // Find category
                const category = await Category.findOne({ name: categoryName.toLowerCase() });
                if (!category) {
                    console.log(`Category not found: ${categoryName}`);
                    errors.push({
                        row: processed,
                        error: 'Category not found',
                        category: categoryName
                    });
                    skipped++;
                    continue;
                }

                // Create and save product
                const product = new Product({
                    name,
                    description,
                    category: category._id,
                    composition,
                    sku,
                    tags
                });

                await product.save();
                products.push({
                    sku,
                    name,
                    categoryName
                });

            } catch (err) {
                console.error(`Error processing row ${processed}:`, err);
                errors.push({
                    row: processed,
                    error: err.message
                });
                skipped++;
            }
        }

        const endTime = Date.now();
        const processingTime = (endTime - startTime) / 1000;

        const summary = {
            message: "Bulk upload completed",
            totalRows: normalizedSheet.length,
            successfulUploads: products.length,
            skippedRows: skipped,
            processingTimeSeconds: processingTime,
            products,
            errors
        };

        console.log('Upload summary:', summary);
        res.status(201).json(summary);

    } catch (err) {
        const endTime = Date.now();
        const processingTime = (endTime - startTime) / 1000;

        console.error('Fatal error in bulk upload:', {
            error: err.message,
            stack: err.stack,
            processingTime
        });

        res.status(500).json({
            error: err.message,
            processingTime,
            errorDetails: err.stack
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: {
                    path: "$categoryDetails",
                    preserveNullAndEmptyArrays: true
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
                    thumbnailImage: 1,
                    productImages: 1,
                    tags: 1,
                    createdAt: 1, // Ensure createdAt is included
                    category: {
                        _id: "$categoryDetails._id",
                        name: "$categoryDetails.name"
                    }
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        res.status(200).json({ products });
    } catch (err) {
        console.error("Error fetching products:", err.message);
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

// Update Product Status
export const updateProductStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        // Validate the status input
        if (!["available", "out of stock"].includes(status)) {
            return res.status(400).json({  message: "Invalid status value. Must be either 'avaiable' or 'out of stock'." });
        }

        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update the status
        product.status = status;

        // Save the updated product
        await product.save();

        res.status(200).json({ message: "Product status updated successfully", product });
    } catch (err) {
        console.error("Error updating product status:", err);
        res.status(500).json({ error: err.message });
    }
};

// Add more images to a product
export const addProductImages = async (req, res) => {
    try {
        const { id } = req.body;

        // Find the product in the database
        const product = await Product.findById(id);
        if (!product) {
            console.error("Product not found for ID:", id); 
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if new images are provided by the middleware
        if (!req.files || !req.files["productImages"]) {
            console.error("No images provided:", JSON.stringify(req.files));  
            return res.status(400).json({ message: "No images uploaded" });
        }

        // Extract the URLs of the uploaded images and assign new IDs
        const newImages = req.files["productImages"].map(file => ({
            _id: new mongoose.Types.ObjectId(), // Assign MongoDB ObjectId for new images
            url: file.path                       // Store the file path or URL
        }));

        // Add the new images to the productImages array
        product.productImages = [...product.productImages, ...newImages];

        // Save the updated product with the new images
        await product.save();

        res.status(200).json({
            message: "Images added successfully",
            productImages: product.productImages,
        });
    } catch (err) {
        console.error(`Error adding images to product:`, err);
        res.status(500).json({ error: err.message });
    }
};
