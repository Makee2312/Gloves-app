import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Settings } from "lucide-react";
import { useDispatch } from "react-redux";
import { setActiveBatch } from "../store/batchListSlice";
import { getBatchStatus, getBatchColor } from "../reusables/getBatchStatus";
// function getBatchStatus(batch) {
//   return batch.status ?? batch.status !== ""
//     ? batch.status
//     : batch.steps[0]?.saved === true
//     ? "In progress"
//     : "Yet to start";
// }

export default function BatchList({ batchList }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [batchesWithStatus, setBatchesWithStatus] = useState(
    batchList
      ? batchList.map((batch) => ({
          ...batch,
          derivedStatus: getBatchStatus(batch),
          isFinished:
            batch.steps && batch.steps.every((step) => step.saved === true),
        }))
      : null
  );

  useEffect(() => {
    if (searchText !== "") {
      setBatchesWithStatus(
        batchList
          ? batchList
              .filter(
                (batch) =>
                  batch.gloveBatchId
                    .toString()
                    .toLocaleLowerCase()
                    .includes(searchText.toLocaleLowerCase()) ||
                  batch.status
                    .toString()
                    .toLocaleLowerCase()
                    .includes(searchText.toLocaleLowerCase())
              )
              .map((batch) => ({
                ...batch,
                derivedStatus: getBatchStatus(batch),
                isFinished:
                  batch.steps &&
                  batch.steps.every((step) => step.saved === true),
              }))
          : []
      );
    } else {
      setBatchesWithStatus(
        batchList
          ? batchList.map((batch) => ({
              ...batch,
              derivedStatus: getBatchStatus(batch),
              isFinished:
                batch.steps && batch.steps.every((step) => step.saved === true),
            }))
          : null
      );
    }
  }, [searchText, batchList]);

  return (
    <>
      <div className="flex items-center gap-2 border rounded-full px-4 py-2 mx-2 mt-4">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          placeholder="Search here"
          className="flex-1 outline-none text-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Settings className="w-4 h-4 text-gray-400" />
      </div>
      <div className="px-6 mt-5 text-sm font-semibold text-gray-600 grid grid-cols-2">
        <span>Batch list</span>
        <span className="text-right">Date &amp; status</span>
      </div>
      <div className="mt-2 mb-12 space-y-3 px-4 flex-1 overflow-y-auto">
        {batchesWithStatus
          ? batchesWithStatus.map((batch) => (
              <div
                key={batch.gloveBatchId}
                className={`grid grid-cols-2 items-center px-5 py-4 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer`}
                onClick={() => {
                  dispatch(setActiveBatch(batch));
                  if (batch.derivedStatus == "In QC") {
                    navigate("/qc", {
                      state: { activeBatchId: batch.gloveBatchId },
                    });
                  } else if (
                    batch.derivedStatus == "Completed" ||
                    batch.derivedStatus == "QC Failed"
                  ) {
                    navigate("/progress", {
                      state: { activeBatchId: batch.gloveBatchId },
                    });
                  } else {
                    navigate("/latexinput", {
                      state: { batchData: batch, viewOnly: !!batch.isFinished },
                    });
                  }
                }}
              >
                {/* Left side - Batch info */}
                <div>
                  <h2 className="font-semibold text-gray-800">
                    Batch #{batch.gloveBatchId}
                  </h2>
                  <p className="text-xs text-gray-500">{batch.description}</p>
                </div>

                {/* Right side - Time and Status */}
                <div className="flex flex-col items-end justify-center space-y-1">
                  <p
                    className={`text-xs px-3 py-1 rounded-full font-semibold text-right
            ${getBatchColor(batch.derivedStatus)}`}
                  >
                    {batch.derivedStatus}
                  </p>
                  <p className="text-xs px-3 text-gray-400 text-right">
                    {batch.createdDate}
                  </p>
                </div>
              </div>
            ))
          : null}
      </div>
    </>
  );
}
