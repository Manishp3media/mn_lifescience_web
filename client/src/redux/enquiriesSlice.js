import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";

// Fetch all products
export const fetchEnquiries = createAsyncThunk(
  "enquiryList/fetchEnquiries",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://mn-life-catalogue.vercel.app/api/admin/get/enquiries",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
  }
);


export const updateEnquiryStatus = createAsyncThunk(
  'enquiryList/updateEnquiryStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        'https://mn-life-catalogue.vercel.app/api/admin/update/enquiry/status',
        { id, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Assuming the API returns the updated enquiry
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.message || "Failed to update status"
      });
    }
  }
);

// Initial date range
const initialDateRange = {
  startDate: null,
  endDate: null,
};

const enquiryListSlice = createSlice({
  name: "enquiry",
  initialState: {
    enquiries: [],
    filteredEnquiries: [],
    dateRange: initialDateRange,
    selectedUser: null,
    selectedCity: null,
    selectedStatus: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
      state.filteredEnquiries = filteredEnquiries(state);
    },
    setClearRange: (state) => {
      state.dateRange = initialDateRange;
      state.filteredEnquiries = filteredEnquiries(state);
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.filteredEnquiries = filteredEnquiries(state);
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
      state.filteredEnquiries = filteredEnquiries(state);
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
      state.filteredEnquiries = filteredEnquiries(state);
    },
    setfilteredEnquiries: (state, action) => {
      state.filteredEnquiries = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnquiries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEnquiries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.enquiries = action.payload;
        // state.filteredEnquiries = filteredEnquiries(state);
      })
      .addCase(fetchEnquiries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateEnquiryStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEnquiryStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';

        // Update the enquiry status in the local state
        const updatedEnquiry = action.payload.updatedEnquiry;
        const index = state.enquiries.findIndex((enquiry) => enquiry._id === updatedEnquiry._id);
        if (index !== -1) {
          state.enquiries[index].status = updatedEnquiry.status;
        }
      })
      .addCase(updateEnquiryStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Helper function to filter enquiries by date range, category, and status
const filteredEnquiries = (state) => {
  return state.enquiries?.filter((enquiry) => {
    const enquiryDate = moment(enquiry?.createdAt);
    const startDate = state.dateRange.startDate
      ? moment(state.dateRange.startDate)
      : null;
    const endDate = state.dateRange.endDate
      ? moment(state.dateRange.endDate)
      : null;

    const isInDateRange = startDate && endDate
      ? enquiryDate.isBetween(startDate, endDate, null, "[]")
      : true;

    const matchesCity = state.selectedCity
      ? enquiry?.city === state.selectedCity
      : true;
    const matchesUser = state.selectedUser
      ? enquiry?.user === state.selectedUser
      : true;

    const matchesStatus = state.selectedStatus
      ? enquiry?.status === state.selectedStatus
      : true;

    return isInDateRange && matchesCity && matchesUser && matchesStatus;
  });
};

// Export actions
export const {
  setDateRange,
  setSelectedUser,
  setSelectedCity,
  setClearRange,
  setSelectedStatus,
  setfilteredEnquiries,
} = enquiryListSlice.actions;

// Export reducer
export default enquiryListSlice.reducer;

