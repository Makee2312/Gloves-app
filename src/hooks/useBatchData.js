// src/hooks/useBatchData.js
import { useEffect, useState } from "react";
import { BatchAPI } from "../api/batch";
import { useNetworkStatus } from "./useNetworkStatus";
import { useSelector, useDispatch } from "react-redux";
import { useSettings } from "../hooks/useSettings";
import { add } from "../store/batchListSlice";
import { fetchBatchList } from "../store/batchListSlice";

export const useBatchData = () => {
  const dispatch = useDispatch();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const isOnline = useNetworkStatus();
  const batchList = useSelector((state) => state.batchList);
  const [settings, saveSettings] = useSettings({
    batchLs: [],
    activeBatch: {},
  });

  const fetchBatches = async () => {
    try {
      setLoading(true);
      if (!isOnline) {
        const data = await BatchAPI.getAllBatches();
        setBatches(data);
        console.log("hitting ", batchList);
      } else {
        if (
          batchList == null ||
          batchList.batchLs == null ||
          batchList.batchLs.length == 0
        ) {
          dispatch(fetchBatchList());
          console.log(batchList);
          setBatches(batchList);
        } else {
          setBatches(batchList);
          saveSettings(batchList);
        }
      }
    } catch (error) {
      console.error("Failed to fetch batches", error);
    } finally {
      setLoading(false);
    }
  };

  const addBatch = async (prod, stepsTemplate) => {
    try {
      if (!isOnline) {
        const newBatch = await BatchAPI.createBatch(prod);
        setBatches((prev) => [...prev, newBatch]);
      } else {
        dispatch(add({ ...prod, steps: stepsTemplate }));
      }
      setBatches(batchList);
      saveSettings(batchList);
    } catch (error) {
      console.error("Failed to add batch", error);
    }
  };

  return { batches, loading, fetchBatches, addBatch };
};
