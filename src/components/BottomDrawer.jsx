import { useEffect, useState } from "react";
import gloveBatches from "../config/defaultBatch";
import { add } from "../store/batchListSlice";
import { useBatchData } from "../hooks/useBatchData";
import { useSelector } from "react-redux";

const stepsTemplate = [
  { data: {}, photo: null, saved: false }, // compoundPrep
  { data: {}, photo: null, saved: false }, // formerPrep
  { data: {}, photo: null, saved: false }, // leaching
  { data: {}, photo: null, saved: false }, // finishing
];

export default function BottomDrawer({ open, setOpen }) {
  const batchesList = useSelector((state) => state.batchList);
  const { loading, fetchBatches, addBatch } = useBatchData();
  const today = new Date();
  const [batchData, setBatchData] = useState({});

  useEffect(() => {
    setBatchData({
      ...gloveBatches,
      gloveBatchId:
        batchesList == null || batchesList.batchLs == null
          ? 110001
          : batchesList.batchLs.length > 0
          ? batchesList.batchLs[batchesList.batchLs.length - 1].gloveBatchId + 1
          : 10001,
      status: "Yet to start",
      createdDate: today.toLocaleDateString("en-IN"),
    });
  }, [open]);

  function addBatchData(prod) {
    addBatch({ ...prod, steps: stepsTemplate });
  }
  return (
    open && (
      <div className="flex flex-col items-center justify-center bg-gray-100">
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setOpen(false)}
        />

        <div
          className={`fixed bottom-0 left-0 w-full bg-white shadow-lg rounded-t-2xl p-4 z-50 transition-transform duration-300 ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mb-3">
            <label className="block mb-1 text-gray-700 font-medium">
              Batch no
            </label>
            <input
              type="text"
              value={batchData.gloveBatchId}
              onChange={(e) =>
                setBatchData({ ...batchData, gloveBatchId: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type here..."
            />
            <label className="block mb-1 text-gray-700 font-medium">
              Counts in batch
            </label>
            <input
              type="number"
              value={batchData.batchCount}
              onChange={(e) =>
                setBatchData({ ...batchData, batchCount: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type here..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                addBatchData(batchData);
                setOpen(false);
              }}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
          <div className="h-[48px] "></div>
        </div>
      </div>
    )
  );
}
