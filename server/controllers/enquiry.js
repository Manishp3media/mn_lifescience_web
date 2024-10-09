import Enquiry from "../models/Enquiry.js";
import Product from "../models/Product.js";

// Create an enquiry
export const createEnquiry = async (req, res) => {
    try {
        const { productIds, price } = req.body; // Assuming products are sent as an array of product IDs
        const id = req.user.id; // Assuming you're using JWT to identify the user

        // Validate that the products exist
        const products = await Product.find({ _id: { $in: productIds } });
        if (products.length !== productIds.length) {
            return res.status(404).json({ message: "Some products were not found" });
        }

        // Create new enquiry
        const newEnquiry = new Enquiry({
            user: id, // Link the user making the enquiry
            products: productIds, // Array of products the user is enquiring about
            price: price,
            status: "yet to contact" // Default status
        });

        // Save the enquiry to the database
        await newEnquiry.save();

        res.status(201).json({ message: "Enquiry created successfully", enquiry: newEnquiry });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 

// Get All Enquiries
export const getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.aggregate([
            {
                $lookup: {
                    from: 'users', // The collection name for users
                    localField: 'user', // Field from the Enquiry collection
                    foreignField: '_id', // Field from the User collection
                    as: 'user' // Output array field for user details
                }
            },
            {
                $unwind: { // Deconstructs the array field from the previous lookup
                    path: '$user',
                    preserveNullAndEmptyArrays: true // Preserve enquiries without users
                }
            },
            {
                $lookup: {
                    from: 'products', // The collection name for products
                    localField: 'products', // Field from the Enquiry collection
                    foreignField: '_id', // Field from the Product collection
                    as: 'productDetails' // Output array field for product details
                }
            },
            {
                $sort: { createdAt: -1 } // Sort by createdAt in descending order
            },
            {
                $project: {
                    // Select the fields to return
                    _id: 1,
                    createdAt: 1,
                    'user.name': 1,
                    'user.mobileNumber': 1,
                    'user.city': 1,
                    price: 1,
                    status: 1,
                    productDetails: {
                        $map: {
                            input: '$productDetails',
                            as: 'product',
                            in: {
                                name: '$$product.name'
                            }
                        }
                    }
                }
            }
        ]);
        res.status(200).json(enquiries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Enquiry Status
export const updateEnquiryStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ message: 'Enquiry status updated successfully', updatedEnquiry });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}