import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../redux/authSlice";
import productListSlice from "../redux/productSlice";
import categorySlice from "../redux/categorySlice";
import enquiryListSlice from "../redux/enquiriesSlice";
import usersSlice from "../redux/usersSlice";
import bannerSlice from "../redux/bannerSlice";
import socialMediaLinkSlice from "../redux/socialMediaSlice"; 
import logoSlice from "../redux/logoSlice";
import termsSlice from "../redux/termsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    productList: productListSlice,
    categoryList: categorySlice,
    enquiryList: enquiryListSlice,
    usersList: usersSlice,
    bannerList: bannerSlice,
    socialMediaLink: socialMediaLinkSlice, 
    logo: logoSlice,
    terms: termsSlice
  },
});

export default store;