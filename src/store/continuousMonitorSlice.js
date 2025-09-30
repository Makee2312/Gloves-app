import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = "https://fakestoreapi.com/products";

const initialState = { data: [], status: "idle" };
// export const getProducts = createAsyncThunk("products/get", async () => {
//   const data = await fetch(API_URL);
//   const result = await data.json();
//   return result;
// });
const continuousMonitorSlice = createSlice({
  name: "continuousMonitorData",
  initialState,
  reducers: {
    // fetchProducts(state, action) {
    //   state.data = action.payload;
    // },
  },
  //   extraReducers: (builder) => {
  //     builder
  //       .addCase(getProducts.pending, (state, action) => {
  //         state.status = "Loading";
  //       })
  //       .addCase(getProducts.fulfilled, (state, action) => {
  //         state.status = "idle";
  //         state.data = action.payload;
  //       })
  //       .addCase(getProducts.rejected, (state, action) => {
  //         state.status = "error";
  //         state.data = action.payload;
  //       });
  //   },
});

export const { fetchProducts } = continuousMonitorSlice.actions;
export default continuousMonitorSlice.reducer;

// export function getProducts() {
//   return async function getProductsThunk(dispatch, getState) {
//     await fetch(API_URL)
//       .then((data) => data.json())
//       .then((result) => dispatch(fetchProducts(result)));
//   };
// }
