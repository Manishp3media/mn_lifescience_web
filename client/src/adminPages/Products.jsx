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
import { fetchProducts, deleteProduct } from '@/redux/productSlice';
import EditProduct from "@/adminComponents/EditProduct";
import ActionDropdown from "@/adminComponents/ActionDropdown";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

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

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const filteredAndSearchedProducts = Array.isArray(filteredProducts)
        ? filteredProducts?.filter(product =>
            product?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setOpenEditModal(true);
    };

    const handleDeleteClick = async (id) => {
        console.log("Delete click initiated for product ID:", id); // Step 1: Initiating delete
    
        if (window.confirm("Are you sure you want to delete this product?")) {
            console.log("User confirmed deletion for product ID:", id); // Step 2: User confirmed
    
            try {
                console.log("Dispatching deleteProduct action for product ID:", id); // Step 3: Dispatching delete action
                const result = await dispatch(deleteProduct(id)).unwrap();
                console.log("Delete successful, result:", result);  // Step 4: Delete success
                toast.success("Product deleted successfully");
            } catch (error) {
                console.error("Delete failed, error:", error); // Step 5: Handle error
                toast.error(error?.message || "Failed to delete product");
            }
        } else {
            console.log("User canceled deletion for product ID:", id); // Step 6: User canceled deletion
        }
    };
    
    

    // if (status === 'loading') {
    //     return <div>Loading...</div>;
    // }

    return (
        <div >
            <AdminNavbar title="Products" onSearch={handleSearch} />

            <Table className="mt-4">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-base font-sm">
                    {filteredAndSearchedProducts.map((product) => (
                        <TableRow key={product?._id}>
                            <TableCell>
                                <div className="flex items-center">
                                    {product?.productImage ? (
                                        <img
                                            src={product?.productImage}
                                            alt={product?.name}
                                            className="object-fit w-[80px] h-[80px] mr-2"
                                        />
                                    ) : (
                                        <div className="w-[80px] h-[80px] flex items-center justify-center mr-2">
                                            <img src="/upload.jpg" />
                                        </div>

                                    )}
                                    <div className="flex flex-col">
                                        <div className="font-medium">{product?.name}</div>
                                        <div className="text-sm text-gray-500">{product?.category.name}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{product?.status}</TableCell>
                            <TableCell>{product?.sku}</TableCell>
                            <TableCell>{product?.description}</TableCell>
                            <TableCell>
                                {deleteStatus === "loading" ? (
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

            {/* Edit Product Modal */}
            <EditProduct isOpen={openEditModal} product={selectedProduct} onClose={() => {
                    setOpenEditModal(false);
                    setSelectedProduct(null);
                }}  />
        </div>
    );
};

export default Products;