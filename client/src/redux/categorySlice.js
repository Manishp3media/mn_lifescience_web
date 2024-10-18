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
        return rejectWithValue({
          error: error.response?.data?.message || "Failed to create category",
        });
      }
    }
  );


  // API call to create category
  export const createCategory = createAsyncThunk(
    "category/createCategory",
    async (categoryData, { rejectWithValue }) => {
      const token = localStorage.getItem("token");
      
      try {
        const response = await axios.post(
          "https://mn-life-catalogue.vercel.app/api/admin/create/category",
          categoryData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data.category;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to create category");
      }
    }
  );

  const cateogorySlice = createSlice({
    name: "categoryList",
    initialState: {
      categories: [],
      createCategoryLoading: false,
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
        .addCase(createCategory.pending, (state) => {
          state.createCategoryLoading = true;
          
        })  
        .addCase(createCategory.fulfilled, (state, action) => {
          state.createCategoryLoading = false;
          state.categories.unshift(action.payload);
        })
        .addCase(createCategory.rejected, (state, action) => {
          state.createCategoryLoading = false;
        });
    },
  });

  export default cateogorySlice.reducer