import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "@/redux/categorySlice";
import { Input } from "@/components/ui/input";
import CustomSpinner from "@/adminComponents/CustomSpinner";
import { toast } from "react-toastify";
import { MAX_FILE_SIZE, supportedFormats } from "@/constant/constant";
import { compressImage } from "./CompressImage";

const CreateCategory = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { createCategoryLoading } = useSelector((state) => state.categoryList);
    const [isCreating, setIsCreating] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [categoryLogo, setCategoryLogo] = useState(null);
    const [errors, setErrors] = useState({});

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setCategoryLogo(file);
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Check for category name
        if (!categoryName) {
            newErrors.name = "Category name is required";
        }

        // Check for category logo
        if (!categoryLogo) {
            newErrors.categoryLogo = "Category logo is required";
        } else if (!supportedFormats.includes(categoryLogo.type)) {
            newErrors.categoryLogo = `Category logo is not a supported format. Please upload jpg, png, jpeg, or webp.`;
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsCreating(true);
        const formData = new FormData();
        formData.append("name", categoryName);
        if (categoryLogo) {
            try {
                // Compress the image before adding it to the form data
                const { file: compressedFile } = await compressImage(categoryLogo);
                formData.append("categoryLogo", compressedFile);
            } catch (error) {
                toast.error("Failed to compress image");
                setIsCreating(false);
                return;
            }
        }

        try {
            await dispatch(createCategory(formData)).unwrap();
            toast.success("Category created successfully");
            handleCloseAndReset();
        } catch (error) {
            const errorMessage = error?.error || error?.message || "Failed to create category";
            toast.error(errorMessage);
        } finally {
            setIsCreating(false);
        }
    };

    const handleCloseAndReset = () => {
        setCategoryName("");
        setCategoryLogo(null);
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCloseAndReset}>
            <DialogContent className="text-color-[#386D62]">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Category Name</label>
                        <Input
                            name="name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="Enter category name"
                        />
                        {errors.name && (
                            <div className="text-red-500">{errors.name}</div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">Category Logo</label>
                        <Input type="file" name="categoryLogo" onChange={handleImageChange} accept="image/*" />
                        {errors.categoryLogo && (
                            <div className="text-red-500">{errors.categoryLogo}</div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? <CustomSpinner size={20} /> : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCategory;
