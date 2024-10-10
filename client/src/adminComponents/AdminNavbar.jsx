import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateProduct from "./CreateProduct";
import { fetchProducts, setSelectedCategory, setSelectedStatus } from '@/redux/productSlice';

const AdminNavbar = ({ title, onSearch }) => {
    const dispatch = useDispatch();
    const [isModalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { products, selectedCategory, selectedStatus } = useSelector(state => state.productList || {});

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value);
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

    const uniqueCategories = Array.isArray(products)
        ? [...new Set(products?.map(product => product?.category?.name))]
        : [];
    const uniqueStatuses = Array.isArray(products)
        ? [...new Set(products?.map(product => product?.status))]
        : [];

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold">{title}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                        <div className="max-w-lg w-full lg:max-w-xs">
                            <label htmlFor="search" className="sr-only">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="search"
                                    name="search"
                                    className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-white bg-opacity-25 text-white placeholder-white focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:ring-0 sm:text-sm"
                                    placeholder="Search products"
                                    type="search"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-100">Category</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {uniqueCategories.map(category => (
                                    <DropdownMenuItem key={category} onSelect={() => handleCategoryFilter(category)}>
                                        {category}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="bg-white text-purple-600 hover:bg-purple-100">Status</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Select Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {uniqueStatuses.map(status => (
                                    <DropdownMenuItem key={status} onSelect={() => handleStatusFilter(status)}>
                                        {status}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={handleOpenModal}
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Add Product
                        </Button>
                    </div>
                </div>
                <div className="flex items-center space-x-2 py-2">
                    {selectedCategory && (
                        <Badge variant="secondary" className="bg-blue-200 text-blue-800 flex items-center">
                            Category: {selectedCategory}
                            <Button variant="ghost" size="sm" onClick={() => clearFilter('category')} className="ml-1 p-0">
                                <X className="h-4 w-4" />
                            </Button>
                        </Badge>
                    )}
                    {selectedStatus && (
                        <Badge variant="secondary" className="bg-purple-200 text-purple-800 flex items-center">
                            Status: {selectedStatus}
                            <Button variant="ghost" size="sm" onClick={() => clearFilter('status')} className="ml-1 p-0">
                                <X className="h-4 w-4" />
                            </Button>
                        </Badge>
                    )}
                </div>
            </div>
            {isModalOpen && <CreateProduct isOpen={isModalOpen} onClose={handleCloseModal} />}
        </nav>
    );
};

export default AdminNavbar;