import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
            return rejectWithValue(error.response.data);
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
            return rejectWithValue(error.response?.data || "Failed to update product");
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