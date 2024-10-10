import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all Categories
export const fetchUsers = createAsyncThunk(
    "usersList/fetchUsers",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://mn-life-catalogue.vercel.app/api/admin/get/users",
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

  const usersSlice = createSlice({
    name: "usersList",
    initialState: {
      users: [],
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchUsers.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.users = action.payload || [];
        })
        .addCase(fetchUsers.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })
    },
  });

  export default usersSlice.reducer