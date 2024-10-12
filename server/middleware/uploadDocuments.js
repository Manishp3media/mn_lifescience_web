import multer from "multer";

import { upload } from "../utils/cloudinary.js";

// Multer middleware for file upload
export const uploadProductImage = upload.fields([
    { name: "productImage", maxCount: 1 } 
]);

export const uploadBannerImage = upload.fields([
    { name: "bannerImage", maxCount: 1 } 
]);

export const uploadLogoImage = upload.fields([
    { name: "logoImage", maxCount: 1 } 
]);

// Set up multer for handling Excel file uploads (store files temporarily in memory or disk)
const excelStorage = multer.memoryStorage(); // Storing files in memory, no need to save on disk

export const uploadExcelFile = multer({
    storage: excelStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only Excel files are allowed.'), false);
        }
    }
}).single("excelFile");  // expecting single Excel file