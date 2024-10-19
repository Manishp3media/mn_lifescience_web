import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { fetchCategories, createCategory } from "@/redux/categorySlice";
import { Input } from "@/components/ui/input";
import CustomSpinner from "@/adminComponents/CustomSpinner";
import { toast } from "react-toastify";

const CreateCategory = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { categories, createCategoryLoading } = useSelector((state) => state.categoryList); 
    const [isCreating, setIsCreating] = useState(false);
    const [categoryLogo, setcategoryLogo] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log("Selected image file:", file);
        setcategoryLogo(file);
    };

    // Formik with initial values and Yup validation schema
    const formik = useFormik({
        initialValues: {
            name: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Category name is required"),
        }),
        onSubmit: async (values) => {
            setIsCreating(true);

            // Create FormData object
            const formData = new FormData();
            formData.append("name", values.name);
            if (categoryLogo) {
                formData.append("categoryLogo", categoryLogo);
            }
      
            try {
              await dispatch(createCategory(formData)).unwrap();
              toast.success("Product created successfully");
              formik.resetForm();
            } catch (error) {
                const errorMessage = error?.error || error?.message || "Failed to create product";
                toast.error(errorMessage);
            } finally {
              setIsCreating(false);
              onClose();
            }
          },
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="text-color-[#386D62]">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Category Name</label>
                        <Input
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter category name"
                            required
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-500">{formik.errors.name}</div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">Category Logo</label>
                        <Input type="file" name="categoryLogo" onChange={handleImageChange} accept="image/*" />
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
