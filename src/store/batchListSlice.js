import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dbContext } from "../db/dbContext";
import { format } from "date-fns";

export const fetchBatchList = createAsyncThunk("batchList/fetch", async () => {
  const batchLs = await dbContext.settings.get(1);
  //console.log(batchLs);
  return batchLs;
});
const now = new Date();
const savedDate = format(now, "dd-MM-yyyy HH:mm:ss");
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
      if (!batch || !batch.steps) return;
    
      batch.status = "In progress";
      batch.steps = batch.steps.map((s, i) =>
        i === stepIdx
          ? { ...s, data: formData, photo, saved: true, saved_date: savedDate }
          : s
      );
    
      // Update activeBatch safely
      if (state.activeBatch?.gloveBatchId === batchId) {
        state.activeBatch = {
          ...batch,
          steps: batch.steps.map((s) => ({ ...s })),
        };
      }
    
      // Optional: auto-mark next step as unlocked
      const allSavedExceptQC = batch.steps
        .slice(0, 4)
        .every((s) => s.saved === true);
      if (allSavedExceptQC) {
        batch.status = "In QC";
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
      const { batchId, qcResultData, photo, saved } = action.payload;
      const batchIndex = state.batchLs.findIndex(
        (b) => b.gloveBatchId === batchId
      );
      const batch = state.batchLs[batchIndex];
      if (batchIndex != -1 && batch) {
        if (batch.steps && batch.steps[4]) {
          batch.steps[4] = {
            ...batch.steps[4],
            data: qcResultData,
            saved: saved,
          };
        }
        if (saved) {
          batch.status = "Completed";
        }
        state.batchLs[batchIndex] = batch;
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
