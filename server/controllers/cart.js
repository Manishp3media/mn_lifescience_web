import Cart from "../models/Cart.js"; // Import the Cart model
import Product from "../models/Product.js"; // Import the Product model

// Add Product to Cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const id = req.user.id; // Assuming you're using JWT to identify the user

        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the cart exists for the user
        let cart = await Cart.findOne({ user: id });
        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = new Cart({ user: id, items: [] });
        }

        // Check if the product already exists in the cart
        const existingCartItem = cart.items.find(item => item.product.toString() === productId);

        if (existingCartItem) {
            // If it exists, update the quantity
            existingCartItem.quantity += quantity;
        } else {
            // If it doesn't exist, add a new item
            cart.items.push({ product: productId, quantity });
        }

        // Save the cart
        await cart.save();
        res.status(200).json({ message: "Product added to cart successfully", cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get User Cart
export const getCart = async (req, res) => {
    try {
        const id = req.user.id; // Assuming you're using JWT to identify the user
        const cart = await Cart.findOne({ user: id }).populate("items.product");
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({ cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Remove Product from Cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const id = req.user.id; // Assuming you're using JWT to identify the user

        // Find the cart for the user
        const cart = await Cart.findOne({ user: id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Filter out the item to remove
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();

        res.status(200).json({ message: "Product removed from cart successfully", cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
