import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { createBanner } from "@/redux/bannerSlice"; // Import the createBanner action
import CustomSpinner from "./CustomSpinner";
import { toast } from "react-toastify";
import { supportedFormats, MAX_FILE_SIZE } from "@/constant/constant";

const AddBanner = ({ isOpen, onClose }) => {
    const [bannerImage, setBannerImage] = useState(null);
    const dispatch = useDispatch();
    const [loading , setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageChange = (event) => {
        setError(null);
        const file = event.target.files[0];
        
        if (file.size > MAX_FILE_SIZE) {
            setError(`Image exceeds the 5 MB size limit. Please upload image of size less than 5 mb`);
            return;
        }

        if (!supportedFormats.includes(file.type)) {
            setError(`Unsupported format. Please upload jpg, png, jpeg, or webp`);
            return;
        }

        setBannerImage(file);
    };

    const handleSubmit = useCallback(
        (event) => {
            event.preventDefault();
    
            if (!bannerImage) {
                console.error("No image selected.");
                toast.error("Please select an image before uploading.");
                return;
            }
    
            const formData = new FormData();
            formData.append("bannerImage", bannerImage);
    
            setLoading(true);
            // Dispatch the createBanner action
            dispatch(createBanner(formData))
                .unwrap() // Ensure we can handle promise resolution properly
                .then(() => {
                    toast.success("Banner uploaded successfully", { autoClose: 3000 });
                    onClose(); // Close the dialog after successful upload
                })
                .catch((error) => {
                    toast.error("Failed to upload banner.");
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [dispatch, bannerImage, onClose]
    );
    

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a New Banner</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input type="file" onChange={handleImageChange} accept="image/*" />
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={loading || !bannerImage || error}>
                            {loading ? <CustomSpinner /> : "Upload"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddBanner;
