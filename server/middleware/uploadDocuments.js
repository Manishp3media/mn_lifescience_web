import { upload } from "../utils/cloudinary.js";

// Multer middleware for file upload
export const uploadProductImage = upload.fields([
    { name: "productImage", maxCount: 1 } // Adjust the field name as needed
]);
