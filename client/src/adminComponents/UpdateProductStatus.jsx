import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { updateStatus } from "@/redux/productSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const UpdateProductStatus = ({ id, newStatus }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleUpdateStatus = (status) => {
        setLoading(true);
        try {
            dispatch(updateStatus({id, status: newStatus}));
        toast.success("Status updated successfully");
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setLoading(false);
        }
        
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleUpdateStatus("avaiable")}>Avaiable</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleUpdateStatus("out of stock")}>Out of stock</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UpdateProductStatus;
