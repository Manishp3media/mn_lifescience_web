import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AdminOptionsNavbar from "@/adminComponents/AdminOptionsNavbar";
import { getAllBanners, deleteBanner } from "@/redux/bannerSlice";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const AdminOptions = () => {
    const dispatch = useDispatch();
    const { banners } = useSelector((state) => state.bannerList);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        dispatch(getAllBanners());
    }, [dispatch]);

    const handleDelete = async (id) => {
        setDeletingId(id); 
        try {
            await dispatch(deleteBanner(id)).unwrap();
            // Ensure currentSlide is updated correctly after deletion
            if (currentSlide >= banners.length - 1) {
                setCurrentSlide(Math.max(0, banners.length - 2));
            }
            toast.success("Banner deleted successfully");
        } catch (error) {
            const errorMessage = error?.error || error?.message || "Failed to create product";
            toast.error(errorMessage);
        } finally {
            setDeletingId(null);
        }
    };

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
                                {deletingId === banner._id ? (
                                    <Loader2 className="animate-spin" w-4 h-4 />
                                ) : (
                                    <Trash2 size={20} />
                                )}
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