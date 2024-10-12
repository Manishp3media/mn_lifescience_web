import React from 'react';
import { useDispatch } from 'react-redux';
import { updateStatus } from '@/redux/productSlice';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from "react";

const UpdateProductStatus = ({ productId, currentStatus }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleUpdateStatus = async (newStatus) => {
        try {
            setLoading(true);
            await dispatch(updateStatus({ id: productId, status: newStatus })).unwrap();
            toast.success('Status updated successfully');
           
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : currentStatus}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleUpdateStatus('available')}>
                    Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus('out of stock')}>
                    Out of Stock
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UpdateProductStatus;