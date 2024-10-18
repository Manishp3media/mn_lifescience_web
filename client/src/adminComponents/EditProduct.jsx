import React, { useEffect, useState, useRef } from 'react';
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
import { descriptionConfig, compositionConfig } from "./JoditConfig";
import JoditEditor from 'jodit-react';
import { useNavigate } from "react-router-dom";

const EditProduct = ({ product, onSave }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories } = useSelector((state) => state.categoryList);
    const [isUpdating, setIsUpdating] = useState(false);
    const {
        filteredProducts = [],
    } = useSelector(state => state.productList || {});

    // const product = filteredProducts;

    // Formik with initial values and Yup validation schema
    const formik = useFormik({
        initialValues: {
            id: product?._id || "",
            name: product?.name || "",
            description: product?.description || "",
            composition: product?.composition || "",
            sku: product?.sku || "",
            category: product?.category?._id || "",
            tags: product?.tags,
            thumbnailImage: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Product name is required"),
            description: Yup.string().required("Description is required"),
            composition: Yup.string().required("Composition is required"),
            sku: Yup.string().required("SKU is required"),
            category: Yup.string().required("Please select a category"),
            // use: Yup.string().required("Use is required"),

            thumbnailImage: Yup.mixed().nullable(), // Allow null for editing
        }),
        onSubmit: async (values) => {
            setIsUpdating(true);
            const data = new FormData();
            for (const key in values) {
                if (values[key] !== null && values[key] !== undefined) {
                    if (key === "thumbnailImage" && values.thumbnailImage instanceof File) {
                        data.append(key, values.thumbnailImage);
                    } else {
                        data.append(key, values[key]);
                    }
                }
            }
            const updatedValues = {
                ...values,
                tags: values.tags,  // Replace the string with an array for submission
            };

            // Log the data being sent to the backend
            console.log("Submitting updated values:", updatedValues);

            try {
                await dispatch(updateProduct(data)).unwrap();
                toast.success("Product updated successfully");
                formik.resetForm();

                // Trigger the onSave callback to show the product list
                if (onSave) {
                    onSave();
                }

                // onClose();
            } catch (error) {
                const errorMessage = error?.error || error?.message || "Failed to create product";
                toast.error(errorMessage);
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
        formik.setFieldValue("thumbnailImage", e.currentTarget.files[0]);
    };

    // Text Editor Config
    const descriptionEditorRef = useRef(null);
    const compositionEditorRef = useRef(null);

    useEffect(() => {
        if (product) {
            formik.setValues({
                id: product?._id,
                name: product?.name,
                description: product?.description,
                composition: product?.composition,
                sku: product?.sku,
                category: product?.category?._id || "",
                // use: product?.use,
                tags: product?.tags || [],
            });
        }
    }, [product]);

    return (
        <div >
            <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 pb-2">Product Name</label>
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

                        {/* Thumbnail Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 pb-2">Thumbnail Image</label>
                            <Input
                                type="file"
                                name="thumbnailImage"
                                onChange={handleFileChange}
                                className="input"
                            />
                            {formik.touched.thumbnailImage && formik.errors.thumbnailImage && (
                                <div className="text-red-500">{formik.errors.thumbnailImage}</div>
                            )}
                        </div>

                        {/* SKU */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 pb-2">SKU</label>
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

                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 pb-2">Category</label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="w-full">
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
                    </div>

                    {/* Description */}
                    <div className="flex flex-col items-center">
                        <div className="max-w-4xl w-full mt-6">
                            <label className="block text-sm font-medium text-gray-700 pb-2">Description</label>
                            <JoditEditor
                                ref={descriptionEditorRef}
                                value={formik.values.description}
                                config={descriptionConfig}
                                tabIndex={2}
                                onBlur={newContent => formik.setFieldValue('description', newContent)}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <div className="text-red-500">{formik.errors.description}</div>
                            )}
                        </div>

                        {/* Composition */}
                        <div className="max-w-4xl w-full mt-6">
                            <label className="block text-sm font-medium text-gray-700 pb-2">Composition</label>
                            <JoditEditor
                                ref={compositionEditorRef}
                                value={formik.values.composition}
                                config={compositionConfig}
                                tabIndex={2}
                                onBlur={newContent => formik.setFieldValue('composition', newContent)}
                            />
                            {formik.touched.composition && formik.errors.composition && (
                                <div className="text-red-500">{formik.errors.composition}</div>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 pb-2">Tags</label>
                        <Input
                            name="tags"
                            value={formik.values.tags}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter tags"
                            required
                        />
                        {formik.touched.tags && formik.errors.tags && (
                            <div className="text-red-500">{formik.errors.tags}</div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="bg-[#386D62] hover:bg-[#386D62]" disabled={isUpdating}>
                            {isUpdating ? <CustomSpinner size={20} /> : "Update"}
                        </Button>
                    </DialogFooter>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;





// <div>
//                     <label className="block">use</label>
//                     <Input
//                         name="use"
//                         value={formik.values.use}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         placeholder="Enter use"
//                         required
//                     />
//                     {formik.touched.use && formik.errors.use && (
//                         <div className="text-red-500">{formik.errors.use}</div>
//                     )}
//                 </div>