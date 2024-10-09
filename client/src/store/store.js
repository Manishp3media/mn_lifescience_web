import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../redux/authSlice";
import productListSlice from "../redux/productSlice";
import categorySlice from "../redux/categorySlice";
import enquiryListSlice from "../redux/enquiriesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    productList: productListSlice,
    categoryList: categorySlice,
    enquiryList: enquiryListSlice
  },
});

export default store;