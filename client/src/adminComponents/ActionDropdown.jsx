import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import { Ellipsis } from "lucide-react";

const ActionDropdown = ({ onEdit, onDelete }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Ellipsis className="h-5 w-5 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer" onClick={onEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={onDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ActionDropdown;
