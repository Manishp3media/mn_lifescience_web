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
import { fetchProducts } from '@/redux/productSlice';
import EditProduct from "@/adminComponents/EditProduct";
import ActionDropdown from "@/adminComponents/ActionDropdown";

const Products = () => {
    const dispatch = useDispatch();
    const {
        filteredProducts = [],
        status,
        error
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

    // const handleDeleteClick = (productId) => {
    //     if (window.confirm("Are you sure you want to delete this product?")) {
    //         dispatch(deleteProduct(productId));
    //     }
    // };

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
                                <ActionDropdown
                                    onEdit={() => handleEditClick(product)}
                                    // onDelete={() => handleDeleteClick(product._id)}
                                />
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