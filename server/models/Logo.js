import mongoose from "mongoose";

const logoSchema = new mongoose.Schema({
    logoImage: {
        type: String,
    }
}, {
    timestamps: true,
});

const Logo = mongoose.model('Logo', logoSchema);
export default Logo;