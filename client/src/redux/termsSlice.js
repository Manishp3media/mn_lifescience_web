import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTerms = createAsyncThunk('terms/fetchTerms', async () => {
    const response = await axios.get('/api/terms');
    return response.data;
});

export const updateTerms = createAsyncThunk('terms/updateTerms', async (content) => {
    const response = await axios.put('/api/terms', { content });
    return response.data;
});

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
            .addCase(fetchTerms.fulfilled, (state, action) => {
                state.content = action.payload.content;
                state.status = 'succeeded';
            })
            .addCase(fetchTerms.pending, (state) => {
                state.status = 'loading';
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
