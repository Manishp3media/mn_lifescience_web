import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { createBanner } from "@/redux/bannerSlice"; // Import the createBanner action
import CustomSpinner from "./CustomSpinner";
import { toast } from "react-toastify";

const AddBanner = ({ isOpen, onClose }) => {
    const [bannerImage, setBannerImage] = useState(null);
    const [token, setToken] = useState("");
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.bannerList); // Get loading state from Redux store

    useEffect(() => {
        // Fetch token when the component mounts
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        } else {
            console.error("No token found");
        }
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log("Selected image file:", file);
        setBannerImage(file);
    };

    const handleSubmit = useCallback(
        (event) => {
            event.preventDefault();
            console.log("Form submitted");

            if (!bannerImage) {
                console.error("No image selected.");
                alert("Please select an image before uploading.");
                return;
            }

            if (!token) {
                console.error("No authentication token available.");
                alert("You are not authenticated. Please log in and try again.");
                return;
            }

            const formData = new FormData();
            formData.append("bannerImage", bannerImage);

            // Dispatch the createBanner action
            dispatch(createBanner(formData))
                .unwrap() // Ensure we can handle promise resolution properly
                .then(() => {
                    toast.success("Banner uploaded successfully", { autoClose: 3000 });
                    onClose(); // Close the dialog after successful upload
                })
                .catch((error) => {
                    console.error("Error uploading banner:", error);
                    toast.error("Failed to upload banner.");
                });
        },
        [dispatch, bannerImage, token, onClose]
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
                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={loading || !token}>
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
