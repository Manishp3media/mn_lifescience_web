import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure category names are unique
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
