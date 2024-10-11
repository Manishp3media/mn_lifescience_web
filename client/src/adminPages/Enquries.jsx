import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchEnquiries } from "@/redux/enquiriesSlice";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import moment from "moment";
import EnquiriesNavbar from "@/adminComponents/EnquiriesNavbar";

const Enquiries = () => {
    const dispatch = useDispatch();
    const {
        enquiries,
        dateRange,
        selectedUser,
        selectedCity,
        selectedStatus,
        status,
        error
    } = useSelector(state => state.enquiryList);

    useEffect(() => {
        dispatch(fetchEnquiries());
    }, [dispatch]);

    const filteredEnquiries = useMemo(() => {
        return enquiries.filter(enquiry => {
            const enquiryDate = moment(enquiry.createdAt).startOf('day');
            const startDate = dateRange.startDate ? moment(dateRange.startDate).startOf('day') : null;
            const endDate = dateRange.endDate ? moment(dateRange.endDate).startOf('day') : null;

            const isInDateRange = !startDate || !endDate || 
                (enquiryDate.isSameOrAfter(startDate) && enquiryDate.isSameOrBefore(endDate));


            const matchesCity = !selectedCity || enquiry?.user?.city === selectedCity;
            const matchesUser = !selectedUser || enquiry?.user?.name === selectedUser;
            const matchesStatus = !selectedStatus || enquiry?.status === selectedStatus;

            return isInDateRange && matchesCity && matchesUser && matchesStatus;
        });
    }, [enquiries, dateRange, selectedCity, selectedUser, selectedStatus]);

    // if (status === 'loading') {
    //     return <div>Loading...</div>;
    // }

    // if (status === 'failed') {
    //     return <div>Error: {error}</div>;
    // }

    return (
        <div>
            <EnquiriesNavbar />
            <div className="p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User Name</TableHead>
                            <TableHead>Mobile Number</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Products</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEnquiries.map((enquiry) => (
                            <TableRow key={enquiry._id}>
                                <TableCell>{enquiry?.user?.name}</TableCell>
                                <TableCell>{enquiry?.user?.mobileNumber}</TableCell>
                                <TableCell>{enquiry?.user?.city}</TableCell>
                                <TableCell>{enquiry?.price}</TableCell>
                                <TableCell>{enquiry?.status}</TableCell>

                                <TableCell>
                                    {enquiry?.createdAt ? moment(enquiry?.createdAt).format('D MMM YYYY') : ''}
                                    <br />
                                    {enquiry?.createdAt ? moment(enquiry?.createdAt).format('hh:mm A') : ''}
                                </TableCell>
                                <TableCell>
                                    {enquiry.productDetails.map((product, index) => (
                                        <span key={index}>
                                            {product?.name}
                                            {index < enquiry?.productDetails.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Enquiries;