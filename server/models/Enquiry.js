import mongoose from 'mongoose';

// Define the enquiry schema
const enquirySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true,
    }],
    price: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["yet to contact", "DND", "confirming order", "order confirmed"],
        default: "yet to contact",
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
