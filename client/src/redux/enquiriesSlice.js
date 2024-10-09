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
        state.filteredEnquiries = filteredEnquiries(state);
      })
      .addCase(fetchEnquiries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

// Helper function to filter enquiries by date range, category, and status
const filteredEnquiries = (state) => {
  return state.enquiries.filter((enquiry) => {
    const enquiryDate = moment(enquiry.createdAt);
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
      ? enquiry.city === state.selectedCity
      : true;
    const matchesUser = state.selectedUser
      ? enquiry.user === state.selectedUser
      : true;

    return isInDateRange && matchesCity && matchesUser;
  });
};

// Export actions
export const {
  setDateRange,
  setSelectedUser,
  setSelectedCity,
  setClearRange,
  setfilteredEnquiries,
} = enquiryListSlice.actions;

// Export reducer
export default enquiryListSlice.reducer;

