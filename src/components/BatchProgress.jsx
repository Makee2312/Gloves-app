import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBatchList } from "../store/batchListSlice";
import { Search, X } from "lucide-react";

export default function BatchProgress() {
  const dispatch = useDispatch();
  const batches = useSelector((state) => state.batchList?.batchLs || []);
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    dispatch(fetchBatchList());
  }, [dispatch]);

  // 🔍 Filter batches as you type
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBatches([]);
    } else {
      const filtered = batches.filter((batch) =>
        batch.gloveBatchId
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredBatches(filtered);
    }
  }, [searchTerm, batches]);

  const currentBatch = batches.find((b) => b.gloveBatchId === selectedBatch);

  const handleSelect = (batchId) => {
    setSelectedBatch(batchId);
    setSearchTerm("");
    setFilteredBatches([]);
    setExpandedBatch(null);
  };

  const handleKeyDown = (e) => {
    if (filteredBatches.length === 0) return;

    if (e.key === "ArrowDown") {
      setFocusedIndex((prev) =>
        prev < filteredBatches.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredBatches.length - 1
      );
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      handleSelect(filteredBatches[focusedIndex].gloveBatchId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white-800 rounded-2xl px-4 4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-800">
            Monitor Batch:{" "}
            <span className="text-gray-700">
              {selectedBatch ? `#${selectedBatch}` : " - "}
            </span>
          </h1>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <div className="flex items-center bg-white rounded-lg shadow-md px-3 py-2 border border-gray-300 focus-within:border-blue-400">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search batch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full outline-none text-gray-700 placeholder-gray-400"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")}>
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Filtered results */}
            {filteredBatches.length > 0 && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredBatches.map((batch, index) => (
                  <button
                    key={batch.gloveBatchId}
                    onClick={() => handleSelect(batch.gloveBatchId)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      focusedIndex === index
                        ? "bg-blue-100"
                        : "hover:bg-blue-50"
                    } ${
                      selectedBatch === batch.gloveBatchId
                        ? "font-semibold text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    Batch #{batch.gloveBatchId}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* No batches available */}
        {/* {batches.length === 0 && (
          <p className="text-gray-500 text-sm italic text-center">
            No batches available. Please load or add data.
          </p>
        )} */}

        {/* Selected Batch Details */}
        {currentBatch ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-5">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-gray-800">
                  Batch #{currentBatch.gloveBatchId}
                </h2>
                <p className="text-xs text-gray-400">
                  Created: {currentBatch.createdDate}
                </p>
              </div>

              {/* Status Badge */}
              {(() => {
                const total = currentBatch.steps?.length || 0;
                const completed =
                  currentBatch.steps?.filter((s) => s.saved)?.length || 0;
                const percent =
                  total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      percent === 100
                        ? "bg-green-100 text-green-700"
                        : percent > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {percent === 100
                      ? "Completed"
                      : percent > 0
                      ? "In Progress"
                      : "Pending"}
                  </span>
                );
              })()}
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-2 rounded-full ${
                  currentBatch.steps?.filter((s) => s.saved)?.length ===
                  currentBatch.steps?.length
                    ? "bg-green-400"
                    : "bg-yellow-300"
                }`}
                style={{
                  width: `${
                    ((currentBatch.steps?.filter((s) => s.saved)?.length || 0) /
                      (currentBatch.steps?.length || 1)) *
                    100
                  }%`,
                }}
              ></div>
            </div>

            {/* Expandable Details */}
            <button
              onClick={() =>
                setExpandedBatch(
                  expandedBatch === currentBatch.gloveBatchId
                    ? null
                    : currentBatch.gloveBatchId
                )
              }
              className="mt-4 w-full text-md text-blue-600 font-medium 
               flex items-center justify-left gap-1"
            >
              {expandedBatch === currentBatch.gloveBatchId
                ? "▲ Hide Details"
                : "▼ View Details"}
            </button>

            {expandedBatch === currentBatch.gloveBatchId && (
              <div className="mt-8 mb-8  border-gray-200 px-auto py-auto pb-auto pt-auto space-y-3">
                {currentBatch.steps.map((step, idx) => {
                  const status = step.saved ? "Completed" : "Not Saved";
                  return (
                    <div
                      key={idx} // ✅ key at top-level
                      className="text-sm rounded-lg relative shadow-sm overflow-hidden border px-3 py-2 border-gray-300 cursor-pointer"
                    >
                      <div
                        className={`text-sm p-3 ${
                          step.saved ? "text-green-600" : "text-gray-600"
                        }`}
                      >
                        <div className="flex justify-between">
                          <p className="font-medium">
                            Step {idx + 1}
                            <br />
                            {step.processType.toUpperCase()}
                          </p>
                          <p className="text-sm font-medium italic">
                            {status}
                            <br />
                            {step.saved_date}
                          </p>
                        </div>
                      </div>
                      {/* inner data map */}
                      {step.data && (
                        <div className="mt-1 mb-2 ml-1 mr-1 grid grid-flow-row-dense sm:grid-cols-2 gap-3 text-medium text-gray-700 px-2">
                          {Object.entries(step.data).map(([key, value]) => (
                            <div
                              key={`${step.processType}-${key}`} // ✅ unique per data item
                              className="group bg-teal-50 relative shadow-lg border border-gray-300 text-sm rounded-xl mb-2 p-4 cursor-pointer"
>
                              <span className="capitalize font-medium text-gray-600">
                                {key.replace(/([A-Z])/g, " $1")}:
                              </span>
                              <span className="px-3 font-medium text-gray-800">
                                {value?.toString() || "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-[200px] text-gray-500 text-center">
            No batches selected for monitoring
          </div>
        )}
      </div>
    </div>
  );
}
