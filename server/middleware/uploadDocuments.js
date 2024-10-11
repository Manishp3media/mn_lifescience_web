import { upload } from "../utils/cloudinary.js";

// Multer middleware for file upload
export const uploadProductImage = upload.fields([
    { name: "productImage", maxCount: 1 } 
]);

export const uploadBannerImage = upload.fields([
    { name: "bannerImage", maxCount: 1 } 
]);