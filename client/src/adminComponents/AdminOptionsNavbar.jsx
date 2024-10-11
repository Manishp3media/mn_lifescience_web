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

const AdminOptionsNavbar = ({ title, onSearch }) => {
    const dispatch = useDispatch();
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold">Admin Options</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                        <div className="max-w-lg w-full lg:max-w-xs">
                           
                           
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={handleOpenModal}
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Add Banner
                        </Button>
                        <Button
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={handleOpenModal}
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Add Social Media Links
                        </Button>
                    </div>
                </div>

            </div>
            {/* {isModalOpen && <CreateProduct isOpen={isModalOpen} onClose={handleCloseModal} />} */}
        </nav>
    );
};

export default AdminOptionsNavbar;