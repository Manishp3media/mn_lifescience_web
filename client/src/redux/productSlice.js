import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

      return response.data.products;
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
      return response.data.product;
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.message || "Failed to create product"
      });
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
      return response.data.product;
    } catch (error) {
      console.log(error, "edit product error");
      return rejectWithValue(error.response?.data || "Failed to update product");
    }
  }
);

// Update Status
export const updateStatus = createAsyncThunk(
  "productList/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        "https://mn-life-catalogue.vercel.app/api/admin/update/status",
        { id, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update status");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "productList/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      console.log("Attempting to delete product with ID:", id); // Step 1: Initiate delete request
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        "https://mn-life-catalogue.vercel.app/api/admin/delete/product",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { id },
        }
      );

      console.log("Delete request succeeded, response:", response.data); // Step 2: Request success
      return id;
    } catch (error) {
      console.error("Error during delete request:", error); // Step 3: Catch and log error
      return rejectWithValue(error.response?.data || "Failed to delete product");
    }
  }
);

// Bulk Upload Products via Excel
export const bulkUploadProducts = createAsyncThunk(
  "productList/bulkUploadProducts",
  async (fileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("excelFile", fileData); // Make sure this matches the expected field name

      const response = await axios.post(
        "http://localhost:5000/api/admin/products/bulk/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data; // Assuming the response contains uploaded products data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload products via Excel"
      );
    }
  }
);

// Delete Images
export const deleteProductImage = createAsyncThunk(
  "productList/deleteProductImage",
  async ({ id, imageId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        "https://mn-life-catalogue.vercel.app/api/admin/delete/product/images",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { id, imageId },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete image");
    }
  }
);

// Add Product Images
export const addProductImages = createAsyncThunk(
  "productList/addProductImages",
  async (formData, { rejectWithValue }) => {
    try {
      console.log('addProductImages thunk: Sending request with formData:', formData);
      const token = localStorage.getItem("token");
      console.log("Token: ", token);
      const response = await axios.patch(
        "https://mn-life-catalogue.vercel.app/api/admin/add/product/images",

        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
      console.log('addProductImages thunk: Response received:', response.data);
      return response.data;
    } catch (error) {
      console.log(error, "add product images error");
      return rejectWithValue(error.response?.data || "Failed to add images");
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
    deleteStatus: "idle",
    bulkUploadStatus: "idle",
    deleteImageStatus: "idle",
    addProductImagesStatus: "idle"
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
        state.products.unshift(action.payload);
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
        state.status = "succeeded";
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
        state.deleteStatus = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
        state.filteredProducts = state.filteredProducts.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload;
      })
      .addCase(updateStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedProduct = action.payload.product;
        const index = state.products.findIndex(
          (product) => product._id === updatedProduct._id
        );
        if (index !== -1) {
          state.products[index].status = updatedProduct.status;
        }
        state.filteredProducts = filterProducts(state);
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Bulk Upload Products via Excel
      .addCase(bulkUploadProducts.pending, (state) => {
        state.bulkUploadStatus = "loading";
      })
      .addCase(bulkUploadProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Check if action.payload.products exists and is an array
        // if (action.payload?.products && Array.isArray(action.payload.products)) {
        //   // Use array spread to add new products at the beginning
        //   state.products = [...action.payload.products, ...state.products];
        // } else if (Array.isArray(action.payload)) {
        //   // If payload is directly an array
        //   state.products = [...action.payload, ...state.products];
        // }
      })
      .addCase(bulkUploadProducts.rejected, (state, action) => {
        state.bulkUploadStatus = "failed";
        state.error = action.payload;
      })
      // Delete Product Image
      .addCase(deleteProductImage.pending, (state) => {
        state.deleteImageStatus = "loading";
      })
      // Handle the success case for deleting a product image
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        state.deleteImageStatus = "succeeded";

        // Find the product and update its images with the one received from the backend
        const productIndex = state.products.findIndex(
          (product) => product._id === action.meta.arg.id // the product id that was passed during the dispatch
        );

        if (productIndex !== -1) {
          state.products[productIndex].productImages = action.payload.productImages;
        }
        state.filteredProducts = filterProducts(state);
      })
      .addCase(deleteProductImage.rejected, (state, action) => {
        state.deleteImageStatus = "failed";
        state.error = action.payload;
      })
      // Add Product Image
      .addCase(addProductImages.pending, (state) => {
        console.log('addProductImages: pending');
        state.addImageStatus = 'loading';
      })
      //   .addCase(addProductImages.fulfilled, (state, action) => {
      //     console.log('Redux: addProductImages fulfilled', action.payload);
      //     state.addImageStatus = 'succeeded';

      //     // Get the productId from the formData that was passed to the thunk
      //     const productId = action.meta.arg.get('id');
      //     const { productImages } = action.payload;

      //     console.log('Redux: Updating images for product:', productId);
      //     console.log('Redux: New images:', productImages);

      //     // Update both products and filteredProducts arrays
      //     const updateProductImages = (products) => {
      //         if (!Array.isArray(products)) return;

      //         const productIndex = products.findIndex(p => p._id === productId);
      //         if (productIndex !== -1) {
      //             // Append new images to existing ones
      //             products[productIndex].productImages = [
      //                 ...products[productIndex].productImages || [],
      //                 ...productImages
      //             ];
      //             console.log('Redux: Updated product images. New count:', 
      //                 products[productIndex].productImages.length);
      //         }
      //     };

      //     if (state.products) updateProductImages(state.products);
      //     if (state.filteredProducts) updateProductImages(state.filteredProducts);
      // })
      // In your reducer's extraReducers
      .addCase(addProductImages.fulfilled, (state, action) => {
        state.addImageStatus = 'succeeded';

        // Get the productId from the formData that was passed to the thunk
        const productId = action.meta.arg.get('id');
        const { productImages } = action.payload;

        // Update both products and filteredProducts arrays
        const updateProductImages = (products) => {
          if (!Array.isArray(products)) return;

          const productIndex = products.findIndex(p => p._id === productId);
          if (productIndex !== -1) {
            // Replace existing images with the complete updated list from API
            products[productIndex].productImages = productImages;
          }
        };

        if (state.products) updateProductImages(state.products);
        if (state.filteredProducts) updateProductImages(state.filteredProducts);
      })
      .addCase(addProductImages.rejected, (state, action) => {
        state.addImageStatus = 'failed';
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
      ? product.category.name === state.selectedCategory
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
