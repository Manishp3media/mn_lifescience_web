import CategoryNavbar from "@/adminComponents/CategoryNavbar";
import React  from "react";
import { fetchCategories } from "@/redux/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";
import NoData from "@/adminComponents/NoData";
import MainLoader from "@/adminComponents/MainLoader";

const Categories = () => {
    const { categories } = useSelector((state) => state.categoryList);
    const dispatch = useDispatch();
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            if (categoriesLoading) return; // Prevent multiple calls
            setCategoriesLoading(true); // Set loading to true before fetching
    
            try {
                await dispatch(fetchCategories());
            } catch (error) {
                console.error("Failed to fetch enquiries:", error);
                // Optionally, you can set an error state here
            } finally {
                setCategoriesLoading(false); // Always set loading to false after fetching
            }
        };
        
        loadCategories();
    }, [dispatch]); 

    if (categoriesLoading) {
        return ( 
        <MainLoader />
        )
    }

    return (
        <div>
            <CategoryNavbar />
            <div className="p-4">
                {categories && categories.length > 0 ? (
                    
                
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Logo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories?.map((category) => (
                            <TableRow key={category._id}>
                                <TableCell>
                                    {category?.name}
                                </TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger className="cursor-pointer text-blue-600">View Logo</DialogTrigger>
                                        <DialogContent>
                                            {category?.categoryLogo ? <img src={category?.categoryLogo} alt="logo" /> : <p>No logo available</p>}
                                        </DialogContent>
                                    </Dialog>


                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                ) : (
                    <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
                  <NoData name="Categories" />
                </div>
                )}
            </div>
        </div>
    )
}

export default Categories