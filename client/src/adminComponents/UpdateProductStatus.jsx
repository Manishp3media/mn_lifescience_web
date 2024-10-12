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

const UpdateProductStatus = ({ productId, currentStatus, onStatusChange }) => {
    const dispatch = useDispatch();

    const handleUpdateStatus = async (newStatus) => {
        try {
            await dispatch(updateStatus({ id: productId, status: newStatus })).unwrap();
            toast.success('Status updated successfully');
            onStatusChange(newStatus);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {currentStatus}
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