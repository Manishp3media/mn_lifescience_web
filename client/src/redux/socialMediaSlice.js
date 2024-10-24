import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addSocialMediaLink = createAsyncThunk(
    "socialMediaLink/addSoicalMediaLink",
    async (socialMediaLink, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "https://mn-life-catalogue.vercel.app/api/admin/add/socialMediaLink",
          socialMediaLink,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data.newLink;
      } catch (error) {
        console.log(error);
        return rejectWithValue({
          error: error.response?.data?.message || "Failed to add social media link",
        });
      }
    }
  );

  // Fetch all social media links
  export const fetchSocialMediaLinks = createAsyncThunk(
    "socialMediaLinkList/fetchSocialMediaLinks",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://mn-life-catalogue.vercel.app/api/admin/get/socialMediaLinks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        return response.data.links;
      } catch (error) {
        console.log(error, "fetch social media links error");
        return rejectWithValue(error.response?.data || "Failed to fetch social media links");
      }
    }
  );


const socialMediaLinkSlice = createSlice({
    name: "socialMediaLinkList",
    initialState: {
      socialMediaLinks: [],
      fetchLoading: false,
      addLoading: false, 
    },
    extraReducers: (builder) => {
        builder
            .addCase(addSocialMediaLink.pending, (state) => {
                state.addLoading = true;
            })
            .addCase(addSocialMediaLink.fulfilled, (state, action) => {
                state.addLoading = false;
                state.socialMediaLinks.push(action.payload);
            })
            .addCase(addSocialMediaLink.rejected, (state, action) => {
                state.addLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchSocialMediaLinks.pending, (state) => {
                state.fetchLoading = true; 
            })
            .addCase(fetchSocialMediaLinks.fulfilled, (state, action) => {  
                state.fetchLoading = false;
                state.socialMediaLinks = action.payload;
            })
            .addCase(fetchSocialMediaLinks.rejected, (state, action) => {
                state.fetchLoading = false;
                state.error = action.payload;
            })
           
    },
});

export default socialMediaLinkSlice.reducer


//   // Update a product
//   export const updateSocialMediaLink = createAsyncThunk(
//     "socialMediaLink/updateSocialMediaLink",
//     async (updatedSocialMediaLink, { rejectWithValue }) => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.patch(
//           "https://mn-life-catalogue.vercel.app/api/admin/edit/socialMediaLink",
//           updatedSocialMediaLink,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         return response.data.updatedLink;
//       } catch (error) {
//         console.log(error, "edit product error");
//         return rejectWithValue(error.response?.data || "Failed to update product");
//       }
//     }
//   );
  
//   .addCase(updateSocialMediaLink.pending, (state) => {
//     state.loading = true;
// })
// .addCase(updateSocialMediaLink.fulfilled, (state, action) => {
//     state.loading = false;
//     state.socialMediaLinks = state.socialMediaLinks.map((link) => {
//         if (link._id === action.payload._id) {
//             return action.payload;
//         }
//         return link;
//     });
// })
// .addCase(updateSocialMediaLink.rejected, (state, action) => {
//     state.loading = false;
//     state.error = action.payload;
// });