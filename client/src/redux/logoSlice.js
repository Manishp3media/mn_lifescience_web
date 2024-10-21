import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch existing logo
export const getLogo = createAsyncThunk(
    "logo/getLogo",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://mn-life-catalogue.vercel.app/api/admin/get/logo", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.logo;
        } catch (error) {
            console.log(error, "add logo error");
            return rejectWithValue(error.response?.data || "Failed to fetch logo");
        }
    }
);

export const addLogo = createAsyncThunk(
    "logo/addLogo",
    async (formData, { rejectWithValue }) => {

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("https://mn-life-catalogue.vercel.app/api/admin/add/logo", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // Required for file uploads
                },
            });
            return response.data.logo;
        } catch (error) {
            console.log(error);
            return rejectWithValue({
                error: error.response?.data?.message || "Failed to create logo"
            });
        }
    }
);

// Update Logo
export const editLogo = createAsyncThunk(
    "logo/editLogo",
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.patch(
                "https://mn-life-catalogue.vercel.app/api/admin/edit/logo",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.logo;
        } catch (error) {
            return rejectWithValue({
                error: error.response?.data?.message || "Failed to update logo"
            });
        }
    }
);

const logoSlice = createSlice({
    name: "logo",
    initialState: {
        logo: {},
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            // Handle getLogo
            .addCase(getLogo.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLogo.fulfilled, (state, action) => {
                state.loading = false;
                state.logo = action.payload;
            })
            .addCase(getLogo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addLogo.pending, (state) => {
                state.loading = true;
            })
            .addCase(addLogo.fulfilled, (state, action) => {
                state.logo = action.payload;
            })
            .addCase(addLogo.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(editLogo.pending, (state) => {
                state.loading = true;
            })
            .addCase(editLogo.fulfilled, (state, action) => {
                state.logo = action.payload;
            })
            .addCase(editLogo.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default logoSlice.reducer;