import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    composition: {
        type: String,
    },
    use: {
        type: String,
    },
    status: {
        type: String,
        enum: ["avaiable", "out of stock"],
        default: "avaiable"
    },
    sku: {
        type: String
    },
    productImage: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the Category model
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Product = mongoose.model('Product', productSchema);
export default Product;
