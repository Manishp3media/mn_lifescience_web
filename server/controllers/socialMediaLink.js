import {SocialMediaLink} from "../models/SocialMediaLink.js";

export const addSocialMediaLink = async (req, res) => {
  try {
    const {
      platform,
      url,
      adminEmail,
      adminMobileNumber,
      whatsappNumber,
      instagram,
      facebook,
      twitter,
      linkedin,
    } = req.body;

    // Create an object with only non-empty fields
    const fieldsToSave = {};
    
    // Only add fields that have values (not empty strings)
    if (adminEmail) fieldsToSave.adminEmail = adminEmail;
    if (adminMobileNumber) fieldsToSave.adminMobileNumber = adminMobileNumber;
    if (whatsappNumber) fieldsToSave.whatsappNumber = whatsappNumber;
    if (instagram) fieldsToSave.instagram = instagram;
    if (facebook) fieldsToSave.facebook = facebook;
    if (twitter) fieldsToSave.twitter = twitter;
    if (linkedin) fieldsToSave.linkedin = linkedin;
    if (platform) fieldsToSave.platform = platform.toLowerCase();
    if (url) fieldsToSave.url = url;

    // If there are no fields to save, return an error
    if (Object.keys(fieldsToSave).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided to save",
      });
    }

    // Check for existing record
    const existingRecord = await SocialMediaLink.findOne({});
    
    if (existingRecord) {
      // Update only the provided fields
      const updatedLink = await SocialMediaLink.findByIdAndUpdate(
        existingRecord._id,
        { $set: fieldsToSave },
        { new: true }
      );

      return res.status(200).json({
        message: "Social media links updated successfully",
        data: updatedLink,
      });
    }

    // If no existing record, create a new one
    const newLink = new SocialMediaLink(fieldsToSave);
    const savedLink = await newLink.save();

    res.status(201).json({
      message: "Social media link added successfully",
      data: savedLink,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Platform already exists",
      });
    }

    res.status(500).json({
      message: "Error adding social media link",
      error: error.message,
    });
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

// Controller to edit an existing social media link
export const editSocialMediaLink = async (req, res) => {
    try {
         // Extract platform, URL, and additional fields from the request body
        const { id, platform, url, adminEmail, adminMobileNumber, whatsappNumber, instagram, facebook, twitter, linkedin } = req.body;

        // Find the existing social media link by ID
        const existingLink = await SocialMediaLink.findById(id);
        if (!existingLink) {
            return res.status(404).json({ message: "Social media link not found" });
        }

        // Check if the new platform is one of the predefined platforms
        const predefinedPlatforms = ["facebook", "instagram", "twitter", "linkedin"];
        const normalizedPlatform = platform ? platform.toLowerCase() : null;

        if (normalizedPlatform && predefinedPlatforms.includes(normalizedPlatform)) {
            // Check if a social media link with the same platform already exists, excluding the current link
            const duplicateLink = await SocialMediaLink.findOne({ platform: normalizedPlatform, _id: { $ne: id } });
            if (duplicateLink) {
                return res.status(400).json({ message: "Social media link for this predefined platform already exists" });
            }
        }

        // Update the existing link with the new data
        existingLink.platform = normalizedPlatform || existingLink.platform; // Update if provided
        existingLink.url = url || existingLink.url; // Update if provided
        existingLink.adminEmail = adminEmail || existingLink.adminEmail; // Update if provided
        existingLink.adminMobileNumber = adminMobileNumber || existingLink.adminMobileNumber; // Update if provided
        existingLink.whatsappNumber = whatsappNumber || existingLink.whatsappNumber; // Update if provided
        existingLink.instagram = instagram || existingLink.instagram; // Update if provided
        existingLink.facebook = facebook || existingLink.facebook; // Update if provided
        existingLink.twitter = twitter || existingLink.twitter; // Update if provided
        existingLink.linkedin = linkedin || existingLink.linkedin; // Update if provided

        // Save the updated link to the database
        const updatedLink = await existingLink.save();

        // Respond with success message and the updated link
        res.status(200).json({
            message: "Social media link updated successfully",
            data: updatedLink,
        });
    } catch (error) {
        // Catch and respond with any errors
        res.status(500).json({ message: "Failed to update social media link", error: error.message });
    }
};
      