import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import CreateProduct from "./CreateProduct";

const AdminNavbar = ({ title }) => {
    const [isModalOpen, setModalOpen] = useState(false);

      // Function to toggle modal
      const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-4">
                    {/* Dynamic Title */}
                    <a href="#" className="flex flex-col items-start">
                        <span className="self-start text-3xl font-semibold whitespace-nowrap dark:text-white">{title}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{`${title} . Dashboard . List`}</span>
                    </a>

                    {/* Mobile Menu Button */}
                    <button
                        data-collapse-toggle="navbar-dropdown"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-dropdown"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>

                    {/* Menu Items */}
                    <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            {/* Add Button */}
                            <Button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 h-[40px] mr-[200px]"
                            onClick={handleOpenModal}
                            >
                                <Plus className="mr-2 h-5" />
                                <span>Add</span>
                            </Button>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Create Product Modal */}
            {isModalOpen && (
                <CreateProduct isOpen={isModalOpen} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default AdminNavbar;
