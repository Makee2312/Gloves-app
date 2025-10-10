import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dbContext } from "../db/dbContext"; 
import { format } from 'date-fns';

export const fetchBatchList = createAsyncThunk("batchList/fetch", async () => {
  const batchLs = await dbContext.settings.get(1);
  //console.log(batchLs);
  return batchLs;
});
const now = new Date();
const savedDate = format(now, 'dd-MM-yyyy HH:mm:ss');
const stepsTemplate = [
  { processType: "latexPreparation", data: {}, photo: null, saved: false },
  { processType: "formerPreparation", data: {}, photo: null, saved: false },
  { processType: "leaching", data: {}, photo: null, saved: false },
  { processType: "finishing", data: {}, photo: null, saved: false },
  { processType: "qc", data: {}, photo: null, saved: false },
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
      const { batchId, stepIdx, formData, photo } = action.payload;
      const batch = state.batchLs.find((b) => b.gloveBatchId === batchId);
      if (batch && batch.steps && batch.steps[stepIdx]) {
        batch.steps[stepIdx] = {
          ...batch.steps[stepIdx],
          data: formData,
          photo,
          saved: true,
          saved_date:savedDate,
        };
      }
      if (
        state.activeBatch &&
        state.activeBatch.gloveBatchId === batchId &&
        state.activeBatch.steps &&
        state.activeBatch.steps[stepIdx]
      ) {
        state.activeBatch.steps[stepIdx] = {
          ...batch.steps[stepIdx],
          data: formData,
          photo,
          saved: true,
          saved_date: savedDate ,
        };
      }
    },
    markAsQCBatch(state, action) {
      const batchId = action.payload;
      const batch = state.batchLs.find((b) => b.gloveBatchId === batchId);
      if (batch) batch.status = "In QC";
      if (state.activeBatch && state.activeBatch.gloveBatchId === batchId) {
        state.activeBatch.status = "In QC";
      }
    },
    updateQCBatch(state, action) {
      const { batchId, qcResultData, photo } = action.payload;
      const batch = state.batchLs.find((b) => b.gloveBatchId === batchId);
      if (batch && batch.steps && batch.steps[4]) {
        batch.steps[4] = {
          ...batch.steps[4],
          data: qcResultData,
          photo,
          saved: true,
        };
      }
      if (
        state.activeBatch &&
        state.activeBatch.gloveBatchId === batchId &&
        state.activeBatch.steps &&
        state.activeBatch.steps[4]
      ) {
        state.activeBatch.steps[4] = {
          ...batch.steps[4],
          data: qcResultData,
          photo,
          saved: true,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBatchList.fulfilled, (state, action) => {
      return (state = action.payload.data);
    });
  },
});

export const {
  add,
  remove,
  setActiveBatch,
  updateStep,
  markAsQCBatch,
  updateQCBatch,
} = batchListSlice.actions;
export default batchListSlice.reducer;
