import { useState } from "react";

import { Search, Settings } from "lucide-react";

export default function BatchList({ batchList, setBatchList }) {
  return (
    <>
      <div className="flex items-center gap-2 border rounded-full px-4 py-2 mx-2 mt-4">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          placeholder="Search here"
          className="flex-1 outline-none text-sm"
        />
        <Settings className="w-4 h-4 text-gray-400" />
      </div>

      <div className="px-4 mt-4 flex justify-between text-sm font-semibold text-gray-600">
        <span>Batch list</span>
        <span>Time &amp; status</span>
      </div>
      <div className="mt-2 space-y-3 px-4 flex-1 overflow-y-auto">
        {batchList.map((batch) => (
          <div
            className={`flex px-4 py-2  ${
              batch.batchStatus == "Completed"
                ? "bg-green-100"
                : batch.batchStatus == "Failed"
                ? "bg-red-200"
                : batch.batchStatus == "In progress"
                ? "bg-blue-100"
                : "bg-gray-100"
            } bg-blue-100 rounded-lg justify-between items-center`}
          >
            <div>
              <p className="font-semibold text-gray-700">
                Batch #{batch.batch}
              </p>
              <p className="text-xs text-gray-500">{batch.batchDesc}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">{batch.batchDate}</p>
              <p
                className={`${
                  batch.batchStatus == "Completed"
                    ? "text-green-600"
                    : batch.batchStatus == "Failed"
                    ? "text-red-600"
                    : batch.batchStatus == "In progress"
                    ? "text-blue-600"
                    : "text-gray-600"
                } text-sm font-semibold`}
              >
                {batch.batchStatus}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
