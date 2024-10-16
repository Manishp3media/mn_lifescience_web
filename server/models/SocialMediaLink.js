import mongoose from 'mongoose';

const socialMediaLinkSchema = new mongoose.Schema({
    platform: {
        type: String,
    },
    url: {
        type: String,
    },
    adminEmail: {
        type: String,
    },
    adminMobileNumber: {
        type: String,
    },
    whatsappNumber: {
        type: String,
    },
    instagram:{
        type: String
    },
    facebook:{
        type: String
    },
    twitter:{
        type: String
    },
    linkedin:{
        type: String
    }
}, {
    timestamps: true,
});

export const SocialMediaLink = mongoose.model('SocialMediaLink', socialMediaLinkSchema);
