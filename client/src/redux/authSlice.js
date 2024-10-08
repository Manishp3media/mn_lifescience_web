import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://mn-life-catalogue.vercel.app/api/admin/login', credentials);
      const { token } = response.data;
      localStorage.setItem('token', token); // Store token in localStorage
      return { isLoggedIn: true, token }; // Return the token and logged in state
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error response
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAdminLoggedIn: !!localStorage.getItem("token"),
    token: localStorage.getItem("token"),
    error: null,
    loading: false,
  },
  reducers: {
    logout(state) {
      state.isAdminLoggedIn = false;
      state.token = null;
      localStorage.removeItem('token'); // Remove token from localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isAdminLoggedIn = action.payload.isLoggedIn;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
