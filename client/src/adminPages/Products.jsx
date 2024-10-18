import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminNavbar from "@/adminComponents/AdminNavbar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchProducts, deleteProduct, deleteProductImage, addProductImages } from '@/redux/productSlice';
import EditProduct from "@/adminComponents/EditProduct";
import ActionDropdown from "@/adminComponents/ActionDropdown";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import UpdateProductStatus from "@/adminComponents/UpdateProductStatus";
import { Input } from "@/components/ui/input";
import ProductImagesPopup from "@/adminComponents/ProductImages";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const Products = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        filteredProducts = [],
        status,
        error,
        deleteStatus,
    } = useSelector(state => state.productList || {});
    const [searchTerm, setSearchTerm] = useState('');
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [laodingProductId, setLoadingProductId] = useState(null);
    const [addingImagesProductId, setAddingImagesProductId] = useState(null);
    const [productsLoading, setProductsLoading] = useState(false);
    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

   

    useEffect(() => {
        const loadProducts = async () => {
            if (productsLoading) return; // Prevent multiple calls
            setProductsLoading(true); // Set loading to true before fetching
    
            try {
                await dispatch(fetchProducts());
            } catch (error) {
                console.error("Failed to fetch enquiries:", error);
                // Optionally, you can set an error state here
            } finally {
                setProductsLoading(false); // Always set loading to false after fetching
            }
        };
        
        loadProducts();
    }, [dispatch]);

    // useEffect(() => {
    //     dispatch(fetchProducts());
    // }, [dispatch]);

    // console.log(filteredProducts);

    const filteredAndSearchedProducts = Array.isArray(filteredProducts)
        ? filteredProducts?.filter(product =>
            product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product?.sku?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setOpenEditModal(true);
    };

    const handleDeleteClick = async (id) => {
        setLoadingProductId(id);
        try {
            const result = await dispatch(deleteProduct(id)).unwrap();

            toast.success("Product deleted successfully");
        } catch (error) {

            toast.error(error?.message || "Failed to delete product");
        } finally {
            // Reset loading product ID after the operation
            setLoadingProductId(null);
        }
    };

    const handleDeleteImage = async (id, imageId) => {
        try {
            await dispatch(deleteProductImage({ id, imageId })).unwrap();
            toast.success("Image deleted successfully");
        } catch (error) {
            toast.error(error?.message || "Failed to delete image");
        }
    };

    const handleAddImages = useCallback(async (productId, files) => {
        setAddingImagesProductId(productId);
        console.log("Adding images for product:", productId);
        try {
            const formData = new FormData();
            formData.append('id', productId); // Append product ID
            files.forEach((file) => {
                formData.append('productImages', file); // Append each file
            });

            await dispatch(addProductImages(formData)).unwrap(); // Pass the formData directly
            toast.success("Images added successfully");
        } catch (error) {
            console.error('Error adding images:', error);
            toast.error(error?.message || "Failed to add images");
        } finally {
            setAddingImagesProductId(null);
        }
    }, [dispatch]);


    const handleSave = () => {
        // Close the edit modal and reset the selected product after a successful update
        setOpenEditModal(false);
        setSelectedProduct(null);
    };

    if (productsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin w-[60px] h-[200px]" />
            </div>
        );
    }


    return (
        <div >
            <AdminNavbar title="Products" onSearch={handleSearch} />
            <div className="p-4">
                {openEditModal && selectedProduct ? (
                    <EditProduct
                        product={selectedProduct}
                        onSave={handleSave}
                    />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Thumbnail Image</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody >
                            {filteredAndSearchedProducts.map((product) => (
                                <TableRow key={product?._id}>
                                    <TableCell>
                                        {product?.name}
                                    </TableCell>

                                    <TableCell>{product?.category?.name}</TableCell>

                                    {/* Clicking on status to open dropdown */}
                                    <TableCell>
                                        <UpdateProductStatus
                                            productId={product._id}
                                            currentStatus={product.status}
                                        />
                                    </TableCell>

                                    <TableCell>{product?.sku}</TableCell>

                                    {/* Thumbnail Image */}
                                    <TableCell>
                                    <Dialog>
                                        <DialogTrigger className="text-blue-700">View Image</DialogTrigger>
                                        <DialogContent className="flex justify-center items-center"> {/* Centering the content */}
                                            {product?.thumbnailImage ? (
                                                <img
                                                    src={product?.thumbnailImage}
                                                    alt="Thumbnail"
                                                    className="h-auto w-auto" // Fixed height with auto width
                                                />
                                            ) : (
                                                <p>No thumbnail image</p>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                    </TableCell>

                                    {/* Product Images */}
                                    <TableCell>
                                        <ProductImagesPopup
                                            images={product?.productImages}
                                            onDeleteImage={(imageId) => handleDeleteImage(product._id, imageId)}
                                            onAddImages={(files) => handleAddImages(product._id, files)}
                                            isLoading={addingImagesProductId === product._id}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Input className="w-[250px] h-[50px]" type="text" value={product?.tags} />
                                    </TableCell>

                                    <TableCell>
                                        {laodingProductId === product?._id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <ActionDropdown
                                                onEdit={() => handleEditClick(product)}
                                                onDelete={() => handleDeleteClick(product._id)}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default Products;