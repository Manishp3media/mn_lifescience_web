import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addLogo, editLogo, getLogo } from "@/redux/logoSlice";
import CustomSpinner from "./CustomSpinner";
import { toast } from "react-toastify";
import { set } from "date-fns";

const AddLogo = ({ isAddLogoOpen, onLogoClose }) => {
    const [logoImage, setLogoImage] = useState(null);
    const dispatch = useDispatch();
    const { logo } = useSelector((state) => state.logo); // Get loading and error state from Redux store
    const [uploadLoading, setUploadLoading] = useState(false);

    // Fetch the existing logo on component mount
    useEffect(() => {
        dispatch(getLogo());
    }, [dispatch, onLogoClose]);


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log("Selected image file:", file);
        setLogoImage(file);
    };

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            console.log("Form submitted");

            if (!logoImage) {
                toast.warning("Please select an image before uploading.");
                return;
            }

            const formData = new FormData();
            formData.append("logoImage", logoImage);

            try {
                setUploadLoading(true);
                if (logo[0]?.logoImage) {

                    // If logo exists, dispatch editLogo
                    formData.append("id", logo[0]._id); // Pass the existing logo ID for update
                    await dispatch(editLogo(formData)).unwrap();
                    toast.success("Logo updated successfully", { autoClose: 3000 });
                } else {
                    // If logo doesn't exist, dispatch addLogo
                    await dispatch(addLogo(formData)).unwrap();
                    toast.success("Logo uploaded successfully", { autoClose: 3000 });
                }
                onLogoClose();
            } catch (error) {
                console.error("Error uploading logo:", error);
                toast.error(error.message || "Failed to upload logo."); // Show specific error message if available
            } finally {
                setUploadLoading(false);
            }
        },
        [dispatch, logoImage, onLogoClose]
    );

    return (
        <Dialog open={isAddLogoOpen} onOpenChange={onLogoClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{logo[0]?.logoImage ? "Update Logo" : "Upload Logo"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input type="file" onChange={handleImageChange} accept="image/*" />
                        {/* {error && <p className="text-red-600">{error}</p>} Show error message if exists */}
                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={uploadLoading}>
                            {uploadLoading ? <CustomSpinner /> : logo[0]?.logoImage ? "Update" : "Upload"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={onLogoClose}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddLogo;
