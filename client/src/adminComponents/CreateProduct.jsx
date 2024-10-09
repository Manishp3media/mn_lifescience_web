import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createProduct } from "@/redux/productSlice";
import { fetchCategories } from "@/redux/categorySlice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import CustomSpinner from "./CustomSpinner";
import { toast } from "react-toastify";

const CreateProduct = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { categories, status } = useSelector((state) => state.categoryList); // Accessing categories and status from Redux store
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories()); // Fetch categories when the component mounts
    }, [dispatch]);

    // Formik with initial values and Yup validation schema
    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            composition: "",
            sku: "",
            category: "",
            productImage: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Product name is required"),
            description: Yup.string().required("Description is required"),
            composition: Yup.string().required("Composition is required"),
            sku: Yup.string().required("SKU is required"),
            category: Yup.string().required("Please select a category"),
            productImage: Yup.mixed().required("Product image is required"),
        }),
        onSubmit: async (values) => {
            setIsCreating(true);
            const data = new FormData();
            for (const key in values) {
              data.append(key, values[key]);
            }
      
            try {
              await dispatch(createProduct(data)).unwrap();
              toast.success("Product created successfully");
              formik.resetForm();
            } catch (error) {
                if (error.response && error.response.status === 400 && error.response.data.message.includes("SKU already exists")) {
                    formik.setFieldError("sku", "SKU already exists. Please use a different one.");
                } else {
                    toast.error("Failed to create product");
                }
                console.error("Error creating product:", error);
            } finally {
              setIsCreating(false);
              onClose();
            }
          },
    });

    const handleCategorySelect = (category) => {
        formik.setFieldValue("category", category);
    };

    const handleFileChange = (e) => {
        formik.setFieldValue("productImage", e.currentTarget.files[0]);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="text-color-[#386D62]">
                <DialogHeader>
                    <DialogTitle>Create New Product</DialogTitle>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block">Product Name</label>
                        <Input
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter product name"
                            required
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-500">{formik.errors.name}</div>
                        )}
                    </div>

                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">{formik.values.category || "Select Category"}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {categories?.map((category) => (
                                    <DropdownMenuItem
                                        key={category._id}
                                        onClick={() => handleCategorySelect(category?.name)}
                                    >
                                        {category?.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {formik.touched.category && formik.errors.category && (
                            <div className="text-red-500">{formik.errors.category}</div>
                        )}
                    </div>

                    <div>
                        <label className="block">Description</label>
                        <Input
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter product description"
                            required
                        />
                        {formik.touched.description && formik.errors.description && (
                            <div className="text-red-500">{formik.errors.description}</div>
                        )}
                    </div>

                    <div>
                        <label className="block">Composition</label>
                        <Input
                            name="composition"
                            value={formik.values.composition}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter composition"
                            required
                        />
                        {formik.touched.composition && formik.errors.composition && (
                            <div className="text-red-500">{formik.errors.composition}</div>
                        )}
                    </div>

                    <div>
                        <label className="block">SKU</label>
                        <Input
                            name="sku"
                            value={formik.values.sku}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter SKU"
                            required
                        />
                        {formik.touched.sku && formik.errors.sku && (
                            <div className="text-red-500">{formik.errors.sku}</div>
                        )}
                    </div>

                    <div>
                        <label className="block">Product Image</label>
                        <Input
                            type="file"
                            name="productImage"
                            onChange={handleFileChange}
                            className="input"
                            required
                        />
                        {formik.touched.productImage && formik.errors.productImage && (
                            <div className="text-red-500">{formik.errors.productImage}</div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="bg-[#386D62] hover:bg-[#386D62]" disabled={isCreating}>
                            {isCreating ? <CustomSpinner size={20} /> : "Create"}
                        </Button>
                        <Button className="hover:bg-red-500" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProduct;
