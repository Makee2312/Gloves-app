import { useEffect, useState } from "react";
import gloveBatches from "../config/defaultBatch";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../store/batchListSlice";

export default function BottomDrawer({ open, setOpen }) {
  const dispatch = useDispatch();
  const batchList = useSelector((state) => state.batchList.batchLs);

  const today = new Date();
  const [batchData, setBatchData] = useState({
    ...gloveBatches,
    gloveBatchId:
      batchList.length > 0
        ? batchList[batchList.length - 1].gloveBatchId + 1
        : 10001,
    status: "Yet to start",
    createdDate: today.toLocaleDateString("en-IN"),
  });

  useEffect(() => {
    console.log(batchList);
    setBatchData({
      ...gloveBatches,
      gloveBatchId:
        batchList.length > 0
          ? batchList[batchList.length - 1].gloveBatchId + 1
          : 10001,
      status: "Yet to start",
      createdDate: today.toLocaleDateString("en-IN"),
    });
  }, [open]);

  function addBatch(prod) {
    dispatch(add(prod));
  }
  return (
    open && (
      <div className="flex flex-col items-center justify-center bg-gray-100">
        (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setOpen(false)}
        />
        )
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
                addBatch(batchData);
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
