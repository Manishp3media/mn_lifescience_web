import Banner from "../models/Banner.js";
import cloudinary from "cloudinary";

export const createBanner = async (req, res) => {
    try {
        // Check if the banner image file is provided
        if (!req.files || !req.files["bannerImage"]) {
            return res.status(400).json({ message: "Banner image is required" });
        }

        // Access the uploaded banner image path
        const bannerImage = req.files["bannerImage"][0].path;

        // Create new banner instance
        const newBanner = new Banner({
            bannerImage
        });

        // Save the banner to the database
        await newBanner.save();

        // Respond with success message and created banner
        res.status(201).json({ message: "Banner created successfully", banner: newBanner });
    } catch (error) {
        console.error("Error creating banner:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllBanners = async (req, res) => {
    const banners = await Banner.find();
    res.status(200).json({ banners });
};

export const deleteBanner = async (req, res) => {
    try {
        // Extract the `id` from `req.body`
        const { id } = req.body;

        // Ensure the id is valid and provided
        if (!id) {
            return res.status(400).json({ message: "Banner ID is required" });
        }

        // Find the banner in the database
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        // Delete image from Cloudinary if it exists
        if (banner.bannerImage) {
            // Extract the public ID from the Cloudinary URL
            const urlParts = banner.bannerImage.split('/');
            const folderAndFile = urlParts.slice(-2).join('/'); // Get last two parts of the path
            const publicId = folderAndFile.split('.')[0]; // Remove file extension
            console.log(`Attempting to delete image with public ID: ${publicId}`);

            try {
                const deletionResult = await cloudinary.v2.uploader.destroy(publicId);
                console.log(`Cloudinary deletion result:`, deletionResult);

                if (deletionResult.result === 'ok') {
                    console.log(`Image deleted successfully from Cloudinary.`);
                } else if (deletionResult.result === 'not found') {
                    console.log(`Image not found in Cloudinary. It may have been deleted already.`);
                } else {
                    console.error(`Unexpected result from Cloudinary deletion:`, deletionResult);
                }
            } catch (cloudinaryError) {
                console.error(`Error deleting image from Cloudinary:`, cloudinaryError);
            }
        }

        // Delete the banner from the database
        const deletedBanner = await Banner.findByIdAndDelete(id);

        res.status(200).json({ message: "Banner deleted successfully", id: deletedBanner._id });
    } catch (error) {
        console.error("Error deleting banner:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
