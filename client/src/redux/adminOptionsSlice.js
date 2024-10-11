import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

  // API call to create category
  export const addSocialMediaLinks = createAsyncThunk(
    "socialMediaLinks/addSocialMediaLinks",
    async (socialMediaLinks, { rejectWithValue }) => {
      const token = localStorage.getItem("token");
      
      try {
        const response = await axios.post(
          "https://mn-life-catalogue.vercel.app/api/admin/add/socialMediaLink",
          socialMediaLinks,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data.newLink;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to add social media links");
      }
    }
  );

  const socialMediaLinksSlice = createSlice({
    name: "socialMediaLinksList",
    initialState: {
      status: "idle",
      error: null,
      socialMediaLinks: [],
    },
    extraReducers: (builder) => {
      builder
        .addCase(addSocialMediaLinks.pending, (state) => {
          state.status = "loading";
        })  
        .addCase(addSocialMediaLinks.fulfilled, (state, action) => {    
          state.status = "succeeded";
          state.socialMediaLinks.push(action.payload);
        })
        .addCase(addSocialMediaLinks.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        });
    },
  });

  export default cateogorySlice.reducer