import CategoryNavbar from "@/adminComponents/CategoryNavbar";
import React  from "react";
import { fetchCategories } from "@/redux/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Categories = () => {
    
    const { categories } = useSelector((state) => state.categoryList); 
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div>
            <CategoryNavbar />
            <div className="p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category._id}>
                            <TableCell>
                                {category.name}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
        </div>
    )
}

export default Categories