import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { updateEnquiryStatus } from "@/redux/enquiriesSlice";
import { toast } from 'react-toastify';

const EnquiryStatusDropdown = ({ enquiryId, currentStatus }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);

    const handleUpdateStatus = async (status) => {
        setLoading(true);
        setSelectedStatus(status);
        try {
            await dispatch(updateEnquiryStatus({ id: enquiryId, status })).unwrap();
            toast.success("Status updated successfully");
        } catch (error) {
            const errorMessage = error?.error || error?.message || "Failed to update status";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : selectedStatus}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleUpdateStatus("yet to contact")}>
                    Yet to Contact
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleUpdateStatus("DND")}>
                    DND
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleUpdateStatus("confirming order")}>
                    Confirming Order
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleUpdateStatus("order confirmed")}>
                    Order Confirmed
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default EnquiryStatusDropdown;
