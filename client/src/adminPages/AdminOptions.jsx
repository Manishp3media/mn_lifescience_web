import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AdminOptionsNavbar from "@/adminComponents/AdminOptionsNavbar";
import { getAllBanners, deleteBanner } from "@/redux/bannerSlice";
import { Trash2 } from "lucide-react";
import { set } from "date-fns";
import CustomSpinner from "@/adminComponents/CustomSpinner";

const AdminOptions = () => {
    const dispatch = useDispatch();
    const { banners, loading } = useSelector((state) => state.bannerList);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [deleting, setDeleting] = useState(false);


    useEffect(() => {
        dispatch(getAllBanners());
    }, [dispatch]);

    const handleDelete = (id) => {
        setDeleting(true);
        dispatch(deleteBanner(id)).then(() => {
            if (currentSlide >= banners.length - 1) {
                setCurrentSlide(Math.max(0, banners.length - 2));
            }
        });
        setDeleting(false);
    }

    return (
        <div className="container mx-auto px-4">
            <AdminOptionsNavbar />
            <h1 className="text-2xl font-bold my-6">Banner Images</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners && banners.map((banner, index) => (
                    <div key={banner._id} className="relative">
                        <div className="mb-2 flex justify-between items-center">
                            <span className="text-sm text-gray-600">Banner {index + 1}</span>
                            <button
                                onClick={() => handleDelete(banner._id)}
                                className="text-red-500 hover:text-red-700"
                                title="Delete banner"
                            >
                             {deleting ? <CustomSpinner size={20} /> :   <Trash2 size={20} />}
                            </button>
                        </div>
                        <img
                            src={banner.bannerImage}
                            alt={`Banner ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOptions;