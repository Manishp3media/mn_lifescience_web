import React, { useState, useEffect } from 'react';
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
import { fetchProducts, deleteProduct, deleteProductImage } from '@/redux/productSlice';
import EditProduct from "@/adminComponents/EditProduct";
import ActionDropdown from "@/adminComponents/ActionDropdown";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import UpdateProductStatus from "@/adminComponents/UpdateProductStatus";
import { Input } from "@/components/ui/input";
import ProductImagesPopup from "@/adminComponents/ProductImages";

const Products = () => {
    const dispatch = useDispatch();
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
    const [openStatusProductId, setOpenStatusProductId] = useState(null);
    const [openImageModal, setOpenImageModal] = useState(false); // State for image modal
    const [currentProductImages, setCurrentProductImages] = useState([]);

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    console.log(filteredProducts);

    const filteredAndSearchedProducts = Array.isArray(filteredProducts)
        ? filteredProducts?.filter(product =>
            product?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
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

    // const handleViewImages = (images) => {
    //     setCurrentProductImages(images); // Set current product images
    //     setOpenImageModal(true); // Open the image modal
    // };

    const handleDeleteImage = async (id, imageId) => {
        try {
            await dispatch(deleteProductImage({id, imageId})).unwrap();
            toast.success("Image deleted successfully");
        } catch (error) {
            toast.error(error?.message || "Failed to delete image");
        }
    };

    return (
        <div >
            <AdminNavbar title="Products" onSearch={handleSearch} />
            <div className="p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Use</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody >
                        {filteredAndSearchedProducts.map((product) => (
                            <TableRow key={product?._id}>
                                <TableCell>
                                    <ProductImagesPopup
                                        images={product?.productImages}
                                        onDeleteImage={(imageId) => handleDeleteImage(product._id, imageId)}
                                    />
                                </TableCell>
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
                                <TableCell>{product?.use}</TableCell>
                                <TableCell>{product?.description}</TableCell>
                                <TableCell>
                                    {/* <Input className="w-[250px] h-[50px]" type="text" value={product?.tags} /> */}
                                    {product?.tags}
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
            </div>

            {/* Edit Product Modal */}
            <EditProduct isOpen={openEditModal} product={selectedProduct} onClose={() => {
                setOpenEditModal(false);
                setSelectedProduct(null);
            }} />
        </div>
    );
};

export default Products;