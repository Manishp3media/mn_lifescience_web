import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addSocialMediaLink = createAsyncThunk(
    "socialMediaLink/addSoicalMediaLink",
    async (socialMediaLink, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "https://mn-life-catalogue.vercel.app/api/admin/add/socialMediaLink",
          socialMediaLink,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data.newLink;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create product");
      }
    }
  );


const socialMediaLinkSlice = createSlice({
    name: "socialMediaLinkList",
    initialState: {
        socialMediaLinks: [],
    },
    extraReducers: (builder) => {
        builder
            .addCase(addSocialMediaLink.pending, (state) => {
                state.loading = true;
            })
            .addCase(addSocialMediaLink.fulfilled, (state, action) => {
                state.loading = false;
                state.socialMediaLinks.push(action.payload);
            })
            .addCase(addSocialMediaLink.rejected, (state, action) => {
                state.loading = false;

            });
    },
});

export default socialMediaLinkSlice.reducer