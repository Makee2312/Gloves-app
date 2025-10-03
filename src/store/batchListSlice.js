import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dbContext } from "../db/dbContext"; // Adjust import path

export const fetchBatchList = createAsyncThunk("batchList/fetch", async () => {
  const batchLs = await dbContext.settings.get(1);
  console.log(batchLs);
  return batchLs;
});
const stepsTemplate = [
  { data: {}, photo: null, saved: false },
  { data: {}, photo: null, saved: false },
  { data: {}, photo: null, saved: false },
  { data: {}, photo: null, saved: false },
];

const initialState = { batchLs: [], activeBatch: {} };

const batchListSlice = createSlice({
  name: "batchList",
  initialState,
  reducers: {
    add(state, action) {
      // Ensure steps array is present!
      const batch = {
        ...action.payload,
        steps: stepsTemplate.map((s) => ({ ...s })),
      };
      state.batchLs.push(batch);
    },
    remove(state, action) {
      state.batchLs = state.batchLs.filter(
        (item) => item.gloveBatchId !== action.payload
      );
    },
    setActiveBatch(state, action) {
      state.activeBatch = action.payload;
    },
    updateStep(state, action) {
      const { batchId, stepIdx, form, photo } = action.payload;
      const batch = state.batchLs.find((b) => b.gloveBatchId === batchId);
      if (batch && batch.steps && batch.steps[stepIdx]) {
        batch.steps[stepIdx] = { data: form, photo, saved: true };
      }
      if (
        state.activeBatch &&
        state.activeBatch.gloveBatchId === batchId &&
        state.activeBatch.steps &&
        state.activeBatch.steps[stepIdx]
      ) {
        state.activeBatch.steps[stepIdx] = { data: form, photo, saved: true };
      }
    },
    completeBatch(state, action) {
      const batchId = action.payload;
      const batch = state.batchLs.find((b) => b.gloveBatchId === batchId);
      if (batch) batch.status = "Completed";
      if (state.activeBatch && state.activeBatch.gloveBatchId === batchId) {
        state.activeBatch.status = "Completed";
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBatchList.fulfilled, (state, action) => {
      console.log(action.payload);
      return (state = action.payload.data);
    });
  },
});

export const { add, remove, setActiveBatch, updateStep, completeBatch } =
  batchListSlice.actions;
export default batchListSlice.reducer;
