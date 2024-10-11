import mongoose from 'mongoose';

const socialMediaLinkSchema = new mongoose.Schema({
    platform: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const SocialMediaLink = mongoose.model('SocialMediaLink', socialMediaLinkSchema);
