import mongoose from 'mongoose';

const socialMediaLinkSchema = new mongoose.Schema({
    platform: {
        type: String,
        unique: true,
    },
    url: {
        type: String,
    },
    adminEmail: {
        type: String,
        unique: true,
    },
    adminMobileNumber: {
        type: String,
        unique: true,
    },
    whatsappNumber: {
        type: String,
        unique: true,
    },
    instagram:{
        type: String,
        unique: true,
    },
    facebook:{
        type: String,
        unique: true,
    },
    twitter:{
        type: String,
        unique: true,
    },
    linkedin:{
        type: String,
        unique: true,
    }
}, {
    timestamps: true,
});

export const SocialMediaLink = mongoose.model('SocialMediaLink', socialMediaLinkSchema);
