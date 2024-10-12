import {SocialMediaLink} from "../models/SocialMediaLink.js";

// Controller to add a new social media link
export const addSocialMediaLink = async (req, res) => {
    try {
        // Extract platform and URL from the request body
        const { platform, url } = req.body;

        // Validate that both platform and URL are provided
        if (!platform || !url) {
            return res.status(400).json({ message: "Platform and URL are required" });
        }

        // Check if a social media link with the same platform already exists
        const existingLink = await SocialMediaLink.findOne({ platform: platform.toLowerCase() });
        if (existingLink) {
            return res.status(400).json({ message: "Social media link for platform already exists" });
        }

        // Create a new social media link object
        const newLink = new SocialMediaLink({
            platform: platform.toLowerCase(),  // Store platform in lowercase for consistency
            url,
        });

        // Save the social media link to the database
        const savedLink = await newLink.save();

        // Respond with success message and the saved link
        res.status(201).json({
            message: "Social media link added successfully",
            data: savedLink,
        });
    } catch (error) {
        // Catch and respond with any errors
        res.status(500).json({ message: "Failed to add social media link", error: error.message });
    }
};


// Get all social media links
export const getAllSocialMediaLinks = async (req, res) => {
    try {
        const links = await SocialMediaLink.find();
        res.status(200).json({ links });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}