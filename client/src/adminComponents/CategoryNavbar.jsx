import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import CreateProduct from "./CreateProduct";
import CreateCategory from "./CreateCategory";
import { Button } from "@/components/ui/button";

const CategoryNavbar = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold">Categories</span>
                    </div>


                </div>
                <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleOpenModal}
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Category
                </Button>
            </div>
            {isModalOpen && <CreateCategory isOpen={isModalOpen} onClose={handleCloseModal} />}
        </nav>
    );
};

export default CategoryNavbar;