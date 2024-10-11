import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchEnquiries, setDateRange, setSelectedUser, setSelectedCity, setClearRange, setSelectedStatus } from "@/redux/enquiriesSlice";
import moment from "moment";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const EnquiriesNavbar = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setModalOpen] = useState(false);
    const {
        enquiries,
        dateRange,
        selectedUser,
        selectedCity,
        selectedStatus,
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

    const handleStatusFilter = (status) => {
        dispatch(setSelectedStatus(status));
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
            case 'status':
                dispatch(setSelectedStatus(null));
                break;
            default:
                break;
        }
    };

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

    const uniqueCities = useMemo(() => [...new Set(enquiries?.map(enquiry => enquiry?.user?.city))], [enquiries]);
    const uniqueUsers = useMemo(() => [...new Set(enquiries?.map(enquiry => enquiry?.user?.name))], [enquiries]);
    const uniqueStatuses = useMemo(() => [...new Set(enquiries?.map(enquiry => enquiry?.status))], [enquiries]);

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold">Enquiries</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Date Range Filter */}
                        <Popover open={isOpen} onOpenChange={setIsOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-100">
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
                                    <Button onClick={applyDateFilter} className="mt-2 bg-blue-600 text-white hover:bg-blue-100">
                                        Apply
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="bg-white text-purple-600 hover:bg-purple-100">Status</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Select status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {uniqueStatuses?.map(status => (
                                    <DropdownMenuItem key={status} onSelect={() => handleStatusFilter(status)}>
                                        {status}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-100">City</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Select City</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {uniqueCities?.map(city => (
                                    <DropdownMenuItem key={city} onSelect={() => handleCityFilter(city)}>
                                        {city}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="bg-white text-purple-600 hover:bg-purple-100">User</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Select user</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {uniqueUsers?.map(user => (
                                    <DropdownMenuItem key={user} onSelect={() => handleUserFilter(user)}>
                                        {user}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                    </div>
                </div>
                <div className="flex items-center space-x-2 py-2">
                    {dateRange.startDate && (
                        <Badge variant="secondary" className="bg-blue-200 text-blue-800 flex items-center">
                            Date Range: {moment(dateRange.startDate).format('DD/MM/YYYY')} - {moment(dateRange.endDate).format('DD/MM/YYYY')}
                            <Button variant="ghost" size="sm" className="ml-1 p-0" onClick={() => clearFilter('date')}>
                                <X className="h-4 w-4" />
                            </Button>
                        </Badge>
                    )}
                    {selectedStatus && (
                        <Badge variant="secondary" className="bg-purple-200 text-purple-800 flex items-center">
                            Status: {selectedStatus}
                            <Button variant="ghost" size="sm" onClick={() => clearFilter('status')} className="ml-1 p-0">
                                <X className="h-4 w-4" />
                            </Button>
                        </Badge>
                    )}
                    {selectedCity && (
                        <Badge variant="secondary" className="bg-blue-200 text-blue-800 flex items-center">
                            Category: {selectedCity}
                            <Button variant="ghost" size="sm" onClick={() => clearFilter('city')} className="ml-1 p-0">
                                <X className="h-4 w-4" />
                            </Button>
                        </Badge>
                    )}
                    {selectedUser && (
                        <Badge variant="secondary" className="bg-purple-200 text-purple-800 flex items-center">
                            User: {selectedUser}
                            <Button variant="ghost" size="sm" onClick={() => clearFilter('user')} className="ml-1 p-0">
                                <X className="h-4 w-4" />
                            </Button>
                        </Badge>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default EnquiriesNavbar;