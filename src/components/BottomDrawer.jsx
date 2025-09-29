import { useState } from "react";

export default function BottomDrawer({
  open,
  setOpen,
  batchList,
  setBatchList,
}) {
  const [batchData, setBatchData] = useState({
    batch: 10004,
    batchStatus: "Yet to start",
    batchDate: "May 6th, 2025",
    batchDesc: " - ",
    count: 1,
  });

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
              value={batchData.batch}
              onChange={(e) =>
                setBatchData({ ...batchData, batch: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type here..."
            />
            <label className="block mb-1 text-gray-700 font-medium">
              Counts in batch
            </label>
            <input
              type="number"
              value={batchData.count}
              onChange={(e) =>
                setBatchData({ ...batchData, count: e.target.value })
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
                setBatchList([...batchList, batchData]);
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
