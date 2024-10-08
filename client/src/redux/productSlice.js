import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";

// Fetch all products
export const fetchProducts = createAsyncThunk(
    "productList/fetchProducts",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://mn-life-catalogue.vercel.app/api/admin/get/products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Assuming the server returns { products: [...] }
        return response.data.products; // Adjust this based on your server's response structure
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch products");
      }
    }
  );
  

// Create a product
export const createProduct = createAsyncThunk(
  "productList/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://mn-life-catalogue.vercel.app/api/admin/create/product",
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create product");
    }
  }
);

// Update a product
export const updateProduct = createAsyncThunk(
  "productList/updateProduct",
  async (updatedProduct, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        "https://mn-life-catalogue.vercel.app/api/admin/edit/product",
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update product");
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  "productList/deleteProduct",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        "https://mn-life-catalogue.vercel.app/api/admin/delete/product",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { id },
        }
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete product");
    }
  }
);

const productListSlice = createSlice({
  name: "productList",
  initialState: {
    products: [],
    filteredProducts: [],
    selectedCategory: null,
    selectedStatus: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filteredProducts = filterProducts(state);
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
      state.filteredProducts = filterProducts(state);
    },
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload || [];
        state.filteredProducts = filterProducts(state);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products.push(action.payload);
        state.filteredProducts = filterProducts(state);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.filteredProducts = filterProducts(state);
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
        state.filteredProducts = state.filteredProducts.filter(
          (product) => product._id !== action.payload
        );
        state.status = "succeeded";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Helper function to filter products by date range, category, and status
const filterProducts = (state) => {
    // Ensure state.products is an array before filtering
    const products = Array.isArray(state.products) ? state.products : [];
    
    return products.filter((product) => {
      const matchesCategory = state.selectedCategory
        ? product.category === state.selectedCategory
        : true;
      const matchesStatus = state.selectedStatus
        ? product.status === state.selectedStatus
        : true;
  
      return matchesCategory && matchesStatus;
    });
  };

// Export actions
export const {
  setSelectedCategory,
  setSelectedStatus,
  setFilteredProducts,
} = productListSlice.actions;

// Export reducer
export default productListSlice.reducer;