import mongoose from 'mongoose';

const termsSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const Terms = mongoose.model('Terms', termsSchema);
export default Terms;
