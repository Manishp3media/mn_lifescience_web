import Logo from "../models/Logo.js";
import cloudinary from "cloudinary";

export const createLogo = async (req, res) => {
    try {
        // Check if the logo image file is provided
        if (!req.files || !req.files["logoImage"]) {
            return res.status(400).json({ message: "Logo image is required" });
        }

        // Access the uploaded logo image path
        const logoImage = req.files["logoImage"][0].path;

        // Create new logo instance
        const newLogo = new Logo({
            logoImage
        });

        // Save the logo to the database
        await newLogo.save();

        // Respond with success message and created logo
        res.status(201).json({ message: "logo created successfully", logo: newLogo });
    } catch (error) {
        console.error("Error creating logo:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Edit Logo
export const editLogo = async (req, res) => {
    try {
        const { id } = req.body;

        const logo = await Logo.findById(id);
        if (!logo) {
            return res.status(404).json({ message: "Logo not found" });
        }

        // Check if logo image file is provided
        if (req.files && req.files["logoImage"] && req.files["logoImage"].length > 0) {
            const logoImage = req.files["logoImage"][0].path;

            // Save the new logo path
            logo.logoImage = logoImage;

            // Deletion of old image logic
            if (logo.logoImage) {
                const urlParts = logo.logoImage.split('/');
                const folderAndFile = urlParts.slice(-2).join('/');
                const publicId = folderAndFile.split('.')[0]; // Remove file extension

                try {
                    const deletionResult = await cloudinary.v2.uploader.destroy(publicId);
                    if (deletionResult.result === 'ok') {
                        console.log(`Previous image deleted successfully from Cloudinary.`);
                    } else if (deletionResult.result === 'not found') {
                        console.log(`Previous image not found in Cloudinary. It may have been deleted already.`);
                    } else {
                        console.error(`Unexpected result from Cloudinary deletion:`, deletionResult);
                    }
                } catch (cloudinaryError) {
                    console.error(`Error deleting old image from Cloudinary:`, cloudinaryError);
                    return res.status(500).json({ message: "Error deleting old image from Cloudinary" });
                }
            }
        } else {
            return res.status(400).json({ message: "Logo image is required" });
        }

        // Save the updated logo document
        await logo.save();
        return res.status(200).json({ message: "Logo updated successfully", logo });
    } catch (error) {
        console.error("Error updating logo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
