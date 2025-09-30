import { createSlice } from "@reduxjs/toolkit";
const initialState = { batchLs: [], activeBatch: {} };
const batchListSlice = createSlice({
  name: "batchList",
  initialState,
  reducers: {
    add(state, action) {
      state.batchLs.push(action.payload);
    },
    remove(state, action) {
      return state.filter((item) => item.id != action.payload.id);
    },
    setActiveBatch(state, action) {
      return { ...state, activeBatch: action.payload };
    },
  },
});

export const { add, remove, setActiveBatch } = batchListSlice.actions;
export default batchListSlice.reducer;
