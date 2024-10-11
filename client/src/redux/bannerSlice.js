import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for creating a banner
export const createBanner = createAsyncThunk(
  "banners/createBanner",
  async (formData, { rejectWithValue }) => {
    console.log("createBanner thunk started", formData);

    try {
        const token = localStorage.getItem("token");
      const response = await axios.post("https://mn-life-catalogue.vercel.app/api/admin/add/banner", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching all banners
export const getAllBanners = createAsyncThunk(
  "banners/getAllBanners",
  async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
      const response = await axios.get("https://mn-life-catalogue.vercel.app/api/admin/get/banners",
        {
        headers: {
          Authorization: `Bearer ${token}`,
        }
    }
      );
      return response.data.banners;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for deleting a banner
export const deleteBanner = createAsyncThunk(
  "banners/deleteBanner",
  async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
      const response = await axios.delete("https://mn-life-catalogue.vercel.app/api/admin/delete/banner",
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id },
    },
      );
      return response.data.id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


  

// Initial state
const initialState = {
  banners: [],
  loading: false,
  error: null,
};

// Banner slice
const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle create banner
    builder
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(action.payload.banner); // Add new banner to the list
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });

    // Handle fetch banners
    builder
      .addCase(getAllBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload; // Set fetched banners
      })
      .addCase(getAllBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });

    // Handle delete banner
    builder
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter(
          (banner) => banner._id !== action.payload
        );
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default bannerSlice.reducer;
