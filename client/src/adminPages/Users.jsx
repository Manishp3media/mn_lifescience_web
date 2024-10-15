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
import UsersAndTersmsNavbar from "@/adminComponents/UsersNavbar";

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
            <UsersAndTersmsNavbar title="Users" />
            <div className="p-4">
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
            </div>
            
        </div>
    );
};

export default Users;

