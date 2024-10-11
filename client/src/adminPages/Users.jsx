import React from "react";
import { useEffect } from "react";
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

const Users = () => {
    const dispatch = useDispatch();
    const { users, status, error } = useSelector((state) => state.usersList);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // if (status === "loading") {
    //     return <div>Loading...</div>;
    // }

    // if (status === "failed") {
    //     return <div>Error: {error}</div>;
    // }

    return (
        <div>
            <AdminNavbar title="Users" />
            <Table >
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Mobile Number</TableHead>
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
                            <TableCell>{user?.mobileNumber}</TableCell>
                            <TableCell>{user?.city}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default Users;

