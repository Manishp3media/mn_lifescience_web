import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all Categories
export const fetchCategories = createAsyncThunk(
    "categoryList/fetchCategories",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://mn-life-catalogue.vercel.app/api/admin/get/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data.categories; 
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch products");
      }
    }
  );

  const cateogorySlice = createSlice({
    name: "categoryList",
    initialState: {
      categories: [],
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchCategories.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchCategories.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.categories = action.payload || [];
        })
        .addCase(fetchCategories.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })
    },
  });

  export default cateogorySlice.reducer