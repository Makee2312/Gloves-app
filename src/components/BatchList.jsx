import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Settings } from "lucide-react";
import { useDispatch } from "react-redux";
import { setActiveBatch } from "../store/batchListSlice";

function getBatchStatus(batch) {
  const steps = batch.steps || [];
  if (steps.length === 0) return "Yet to start";
  const allSaved = steps.every(step => step.saved === true);
  if (allSaved) return "Completed";
  if (steps[0]?.saved === true) return "In progress";
  return "Yet to start";
}

export default function BatchList({ batchList }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Map status for each batch
  const batchesWithStatus = batchList.map((batch) => ({
    ...batch,
    derivedStatus: getBatchStatus(batch),
    isFinished: batch.steps && batch.steps.every(step => step.saved === true)
  }));

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
        {batchesWithStatus.map((batch) => (
          <div
            key={batch.gloveBatchId}
            className={`flex px-4 py-2  ${
              batch.derivedStatus === "Completed"
                ? "bg-green-100"
                : batch.derivedStatus === "Failed"
                ? "bg-red-200"
                : batch.derivedStatus === "In progress"
                ? "bg-blue-100"
                : "bg-gray-100"
            } rounded-lg justify-between items-center cursor-pointer`}
            onClick={() => {
              dispatch(setActiveBatch(batch));
              if (batch.isFinished) {
                navigate("/latexinput", {
                  state: { batchData: batch, viewOnly: true },
                });
              } else {
                navigate("/latexinput", {
                  state: { batchData: batch, viewOnly: false },
                });
              }
            }}
          >
            <div>
              <p className="font-semibold text-gray-700">
                Batch #{batch.gloveBatchId}
              </p>
              <p className="text-xs text-gray-500">{batch.description}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">{batch.createdDate}</p>
              <p
                className={`${
                  batch.derivedStatus === "Completed"
                    ? "text-green-600"
                    : batch.derivedStatus === "Failed"
                    ? "text-red-600"
                    : batch.derivedStatus === "In progress"
                    ? "text-blue-600"
                    : "text-gray-600"
                } text-sm font-semibold`}
              >
                {batch.derivedStatus}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}