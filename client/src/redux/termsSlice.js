import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTerms = createAsyncThunk(
    'terms/fetchTerms',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://mn-life-catalogue.vercel.app/api/admin/get/terms',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch terms');
        }
    });

export const updateTerms = createAsyncThunk(
    'terms/updateTerms',
    async (content, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token'); // Get token from local storage

            // Set the Authorization header
            const response = await axios.put('https://mn-life-catalogue.vercel.app/api/admin/update/terms', { content }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token to headers
                },
            });

            return response.data; // Return the response data on success
        } catch (error) {
            // Use rejectWithValue to return the error message
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

const termsSlice = createSlice({
    name: 'terms',
    initialState: {
        content: '',
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchTerms.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTerms.fulfilled, (state, action) => {
                state.content = action.payload.content;
                state.status = 'succeeded';
            })
            .addCase(fetchTerms.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateTerms.fulfilled, (state, action) => {
                state.content = action.payload.content;
            });
    }
});

export default termsSlice.reducer;
