import CategoryNavbar from "@/adminComponents/CategoryNavbar";
import React from "react";
import { fetchCategories } from "@/redux/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react";

const Categories = () => {

    const { categories } = useSelector((state) => state.categoryList);
    const dispatch = useDispatch();
    const [categoriesLoading, setCategoriesLoading] = React.useState(false);

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
            </div>
        </div>
    )
}

export default Categories