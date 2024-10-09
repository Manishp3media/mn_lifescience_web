import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminNavbar from "@/adminComponents/AdminNavbar";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchProducts, setSelectedCategory, setSelectedStatus } from '@/redux/productSlice';
import { Image, Ellipsis} from "lucide-react";

const Products = () => {
    const dispatch = useDispatch();
    const {
        products = [],
        filteredProducts = [],
        selectedCategory,
        selectedStatus,
        status,
        error
    } = useSelector(state => state.productList || {});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCategoryFilter = (category) => {
        dispatch(setSelectedCategory(category));
    };

    const handleStatusFilter = (status) => {
        dispatch(setSelectedStatus(status));
    };

    const clearFilter = (filterType) => {
        if (filterType === 'category') {
            dispatch(setSelectedCategory(null));
        } else if (filterType === 'status') {
            dispatch(setSelectedStatus(null));
        }
    };

    const filteredAndSearchedProducts = Array.isArray(filteredProducts)
        ? filteredProducts?.filter(product =>
            product?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const uniqueCategories = Array.isArray(products)
        ? [...new Set(products.map(product => product.category))]
        : [];
    const uniqueStatuses = Array.isArray(products)
        ? [...new Set(products.map(product => product.status))]
        : [];

    // if (status === 'loading') {
    //     return <div>Loading...</div>;
    // }

    // if (status === 'failed') {
    //     return <div>Error: {error}</div>;
    // }

    return (
        <div >
            <AdminNavbar title="Products" />
           
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
                                        <div className="text-sm text-gray-500">{product?.category}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{product?.status}</TableCell>
                            <TableCell>{product?.sku}</TableCell>
                            <TableCell>{product?.description}</TableCell>
                            <TableCell>
                                <Ellipsis />
                            </TableCell>
                        </TableRow>

                    ))}
                </TableBody>


            </Table>
        </div>
    );
};

export default Products;