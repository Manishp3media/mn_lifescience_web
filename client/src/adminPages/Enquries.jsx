import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchEnquiries, setDateRange, setSelectedUser, setSelectedCity, setClearRange } from "@/redux/enquiriesSlice";
import AdminNavbar from "@/adminComponents/AdminNavbar";
import { X } from "lucide-react";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import moment from "moment";

const Enquiries = () => {
    const dispatch = useDispatch();
    const {
        enquiries,
        dateRange,
        selectedUser,
        selectedCity,
        status,
        error
    } = useSelector(state => state.enquiryList);

    const [isOpen, setIsOpen] = useState(false);
    const [tempStartDate, setTempStartDate] = useState('');
    const [tempEndDate, setTempEndDate] = useState('');

    useEffect(() => {
        dispatch(fetchEnquiries());
    }, [dispatch]);

    const handleCityFilter = (city) => {
        dispatch(setSelectedCity(city));
    };

    const handleUserFilter = (user) => {
        dispatch(setSelectedUser(user));
    };

    const handleDateChange = (date, isStart) => {
        if (isStart) {
            setTempStartDate(date);
        } else {
            setTempEndDate(date);
        }
    };

    const applyDateFilter = () => {
        dispatch(setDateRange({
            startDate: tempStartDate ? moment(tempStartDate).startOf('day').toISOString() : null,
            endDate: tempEndDate ? moment(tempEndDate).endOf('day').toISOString() : null
        }));
        setIsOpen(false);
    };

    const clearFilter = (filterType) => {
        switch (filterType) {
            case 'city':
                dispatch(setSelectedCity(null));
                break;
            case 'user':
                dispatch(setSelectedUser(null));
                break;
            case 'date':
                dispatch(setClearRange());
                setTempStartDate('');
                setTempEndDate('');
                break;
            default:
                break;
        }
    };

    const isDateRangeSelected = dateRange.startDate && dateRange.endDate;

    const filteredEnquiries = useMemo(() => {
        return enquiries.filter(enquiry => {
            const enquiryDate = moment(enquiry.createdAt).startOf('day');
            const startDate = dateRange.startDate ? moment(dateRange.startDate).startOf('day') : null;
            const endDate = dateRange.endDate ? moment(dateRange.endDate).startOf('day') : null;

            const isInDateRange = !startDate || !endDate || 
                (enquiryDate.isSameOrAfter(startDate) && enquiryDate.isSameOrBefore(endDate));


            const matchesCity = !selectedCity || enquiry.user.city === selectedCity;
            const matchesUser = !selectedUser || enquiry.user.name === selectedUser;

            return isInDateRange && matchesCity && matchesUser;
        });
    }, [enquiries, dateRange, selectedCity, selectedUser]);

    const uniqueCities = useMemo(() => [...new Set(enquiries.map(enquiry => enquiry.user.city))], [enquiries]);
    const uniqueUsers = useMemo(() => [...new Set(enquiries.map(enquiry => enquiry.user.name))], [enquiries]);
      

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <AdminNavbar title="Enquiries" />
            <div className="p-4">
                <div className="flex items-center mt-4 space-x-2">
                    {!selectedCity && !selectedUser && !dateRange.startDate && (
                        <h6>No filters applied</h6>
                    )}
                    {selectedCity && (
                        <Badge variant="secondary" className="flex items-center">
                            City: {selectedCity}
                            <Button variant="ghost" size="sm" onClick={() => clearFilter('city')}>
                                <X className="h-4 w-4" />
                            </Button>
                        </Badge>
                    )}
                    {selectedUser && (
                        <Badge variant="secondary" className="flex items-center">
                            User: {selectedUser}
                            <Button variant="ghost" size="sm" onClick={() => clearFilter('user')}>
                                <X className="h-4 w-4" />
                            </Button>
                        </Badge>
                    )}
                    {dateRange.startDate && (
                        <Badge variant="secondary" className="flex items-center">
                            Date Range: {moment(dateRange.startDate).format('DD/MM/YYYY')} - {moment(dateRange.endDate).format('DD/MM/YYYY')}
                            <Button variant="ghost" size="sm" onClick={() => clearFilter('date')}>
                                <X className="h-4 w-4" />
                            </Button>
                        </Badge>
                    )}

                </div>
                <div className="flex space-x-2 mt-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">City</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Select City</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {uniqueCities.map(city => (
                                <DropdownMenuItem key={city} onSelect={() => handleCityFilter(city)}>
                                    {city}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">User</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Select User</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {uniqueUsers.map(user => (
                                <DropdownMenuItem key={user} onSelect={() => handleUserFilter(user)}>
                                    {user}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="bg-[#FBFAD6] relative">
                                Date Range
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium text-gray-700">Start Date:</label>
                                <input
                                    type="date"
                                    value={tempStartDate}
                                    onChange={(e) => handleDateChange(e.target.value, true)}
                                    className="border rounded px-2 py-1"
                                />
                                <label className="text-sm font-medium text-gray-700">End Date:</label>
                                <input
                                    type="date"
                                    value={tempEndDate}
                                    onChange={(e) => handleDateChange(e.target.value, false)}
                                    className="border rounded px-2 py-1"
                                />
                                <Button onClick={applyDateFilter} className="mt-2">
                                    Apply
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
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
                                <TableCell>{enquiry.user.name}</TableCell>
                                <TableCell>{enquiry.user.mobileNumber}</TableCell>
                                <TableCell>{enquiry.user.city}</TableCell>
                                <TableCell>{enquiry.price}</TableCell>
                                <TableCell>{enquiry.status}</TableCell>

                                <TableCell>
                                    {enquiry?.createdAt ? moment(enquiry?.createdAt).format('D MMM YYYY') : ''}
                                    <br />
                                    {enquiry?.createdAt ? moment(enquiry?.createdAt).format('hh:mm A') : ''}
                                </TableCell>
                                <TableCell>
                                    {enquiry.productDetails.map((product, index) => (
                                        <span key={index}>
                                            {product.name}
                                            {index < enquiry.productDetails.length - 1 ? ', ' : ''}
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