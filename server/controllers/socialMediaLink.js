import { SocialMediaLink } from "../models/SocialMediaLink.js";
import { z } from "zod";
import { socialMediaLinkSchema } from "../validation/socialMediaLink.js";

// Add social media link
export const addSocialMediaLink = async (req, res) => {
    try {
        // Validate request body using Zod
        const validatedData = socialMediaLinkSchema.parse(req.body);
        
        const newLink = new SocialMediaLink(validatedData);
        
        await newLink.save();
        res.status(201).json({ message: 'Social media link added successfully!', newLink });
    } catch (err) {
        if (err instanceof z.ZodError) {
            // Handle Zod validation error
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });
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