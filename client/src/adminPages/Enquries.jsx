import AdminNavbar from "@/adminComponents/AdminNavbar";
import React, { useState, useEffect } from 'react';
import { fetchEnquiries } from "@/redux/enquiriesSlice";
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
import { useDispatch, useSelector } from "react-redux";

const Enquries = () => {
    const dispatch = useDispatch();
    const {
        enquiries  = [],
        filteredEnquiries = [],
        selectedUser,
        selectedCity,
        status,
        error
    } = useSelector(state => state.enquiryList  || {});

    useEffect(() => {
        dispatch(fetchEnquiries());
    }, [dispatch]);

    console.log(enquiries);

 
   
    return (
         <div>
            <AdminNavbar title="Enquiries" />
         </div>
    )
};

export default Enquries;