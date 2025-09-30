import { configureStore } from "@reduxjs/toolkit";
import batchListSlice from "./batchListSlice";
import continuousMonitorSlice from "./continuousMonitorSlice";
const store = configureStore({
  reducer: {
    batchList: batchListSlice,
    continuousMonitor: continuousMonitorSlice,
  },
});
export default store;
