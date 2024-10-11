import Mongoose from "mongoose";

const bannerSchema = new Mongoose.Schema({
    bannerImage: {
        type: String,
    }
}, {
    timestamps: true,
});

const Banner = Mongoose.model('Banner', bannerSchema);
export default Banner;