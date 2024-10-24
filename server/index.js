import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import enquiryRoutes from "./routes/enquiry.js";
import socialMedialLinkRoutes from "./routes/socialMediaLink.js"
import bannerRoutes from "./routes/banner.js";
import logoRoutes from "./routes/logo.js";
import termsRoutes from "./routes/terms.js";
import authMiddleware from "./middleware/auth.js";

dotenv.config(); // Load environment variables from .env file

const app = express();

const router = express.Router();

// CORS configuration to allow all origins
app.use(cors({
  origin: "*", // Allow all origins
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  credentials: true
}));

// Middleware to parse JSO
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", enquiryRoutes);
app.use("/api", socialMedialLinkRoutes);
app.use("/api", bannerRoutes);
app.use("/api", logoRoutes);
app.use("/api", termsRoutes);

// // Global error handler
// app.use((err, req, res, next) => {
//     logger.error('Unhandled error:', err);
//     res.status(500).json({ error: 'An unexpected error occurred' });
//   });

app.get("/", (req, res) => {
    res.json({ message: "Hello World from backend"});
})

// Database connection
mongoose
    .connect(process.env.MONGO_URL, {
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch((error) => console.log(`${error} did not connect`));



// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));