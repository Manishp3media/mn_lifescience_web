import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model for users
        required: true,
    },
    items: [cartItemSchema], // Array of cart items
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
