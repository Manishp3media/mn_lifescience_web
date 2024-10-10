import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updateProduct } from '@/redux/productSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'react-toastify';
import CustomSpinner from "./CustomSpinner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchCategories } from "@/redux/categorySlice";

const EditProduct = ({ isOpen, onClose, product }) => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.categoryList);
    const [isUpdating, setIsUpdating] = useState(false);
    
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Formik with initial values and Yup validation schema
    const formik = useFormik({
        initialValues: {
            id: product?._id || "",
            name: product?.name || "",
            description: product?.description || "",
            composition: product?.composition || "",
            sku: product?.sku || "",
            category: product?.category?._id || "",
            productImage: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Product name is required"),
            description: Yup.string().required("Description is required"),
            composition: Yup.string().required("Composition is required"),
            sku: Yup.string().required("SKU is required"),
            category: Yup.string().required("Please select a category"),
            productImage: Yup.mixed().nullable(), // Allow null for editing
        }),
        onSubmit: async (values) => {
            setIsUpdating(true);
            const data = new FormData();
            for (const key in values) {
                if (values[key] !== null && values[key] !== undefined) {
                    data.append(key, values[key]);
                    console.log(key, values[key]);
                }
            }
            try {
                await dispatch(updateProduct(data)).unwrap();
                toast.success("Product updated successfully");
                formik.resetForm();
                onClose();
            } catch (error) {
                if (error.response && error.response.status === 400 && error.response.data.message.includes("SKU already exists")) {
                    formik.setFieldError("sku", "SKU already exists. Please use a different one.");
                } else {
                    toast.error("Failed to update product");
                }
                console.error("Error updating product:", error);
            } finally {
                setIsUpdating(false);
            }
        },
    });

    const handleCategorySelect = (categoryId) => {
        formik.setFieldValue("category", categoryId);
    };

    const handleFileChange = (e) => {
        formik.setFieldValue("productImage", e.currentTarget.files[0]);
    };


    useEffect(() => {
        if (product) {
            formik.setValues({
                id: product?._id,
                name: product?.name,
                description: product?.description,
                composition: product?.composition,
                sku: product?.sku,
                category: product?.category?._id || "",
                productImage: null, // Reset image on edit
            });
        }
    }, [product]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="text-color-[#386D62]">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
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

                    {/* Category Selection */}
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {categories.find(cat => cat._id === formik.values.category)?.name || "Select Category"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {categories?.map((category) => (
                                    <DropdownMenuItem
                                        key={category._id}
                                        onClick={() => handleCategorySelect(category._id, category.name)}
                                    >
                                        {category.name}
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
                        />
                        {formik.touched.productImage && formik.errors.productImage && (
                            <div className="text-red-500">{formik.errors.productImage}</div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="bg-[#386D62] hover:bg-[#386D62]" disabled={isUpdating}>
                            {isUpdating ? <CustomSpinner size={20} /> : "Update"}
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

export default EditProduct;
