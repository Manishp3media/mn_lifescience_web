import mongoose from 'mongoose';

const socialMediaLinkSchema = new mongoose.Schema({
    platform: {
        type: String,
        required: true,
        enum: ['Whatsapp','Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube'], // Add more platforms as needed
    },
    url: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const SocialMediaLink = mongoose.model('SocialMediaLink', socialMediaLinkSchema);
