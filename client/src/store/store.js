import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../redux/authSlice";
import productListSlice from "../redux/productSlice";
import categorySlice from "../redux/categorySlice";
import enquiryListSlice from "../redux/enquiriesSlice";
import usersSlice from "../redux/usersSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    productList: productListSlice,
    categoryList: categorySlice,
    enquiryList: enquiryListSlice,
    usersList: usersSlice
  },
});

export default store;