import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminNavbar from "@/adminComponents/AdminNavbar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { fetchUsers } from "@/redux/usersSlice";
import moment from "moment";
import UsersAndTersmsNavbar from "@/adminComponents/UsersNavbar";
import { Loader2 } from "lucide-react";
import NoData from "@/adminComponents/NoData";
import MainLoader from "@/adminComponents/MainLoader";

const Users = () => {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.usersList);
    const [usersLoading, setUsersLoading] = useState(false);

    useEffect(() => {
        const loadUsers = async () => {
            if (usersLoading) return; // Prevent multiple calls
            setUsersLoading(true); // Set loading to true before fetching
    
            try {
                await dispatch(fetchUsers());
            } catch (error) {
                console.error("Failed to fetch enquiries:", error);
                // Optionally, you can set an error state here
            } finally {
                setUsersLoading(false); // Always set loading to false after fetching
            }
        };
        
        loadUsers();
    }, [dispatch]);

    if (usersLoading) {
        return  (
            <MainLoader />
        )
    }


    return (
        <div>
            <UsersAndTersmsNavbar title="Users" />
            <div className="p-4">
            {users && users.length > 0 ? (
            <Table >
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Clinic Name</TableHead>
                        <TableHead>Mobile Number</TableHead>
                        <TableHead>Speciality</TableHead>
                        <TableHead>City</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users?.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell>
                                {user?.createdAt ? moment(user?.createdAt).format('D MMM YYYY') : ''}
                                <br />
                               
                            </TableCell>
                            <TableCell>{user?.name}</TableCell>
                            <TableCell>{user?.clinicName}</TableCell>
                            <TableCell>{user?.mobileNumber}</TableCell>
                            <TableCell>{user?.speciality}</TableCell>
                            <TableCell>{user?.city}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            ) : (
                <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
                <NoData name="Users" />
              </div>
            )}
            </div>
        </div>
    );
};

export default Users;

