import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBatchList } from "../store/batchListSlice";

export default function BatchProgress() {
  const dispatch = useDispatch();
  const batches = useSelector((state) => state.batchList?.batchLs || []);
  const [expandedBatch, setExpandedBatch] = useState(null);

  // If data not yet fetched, fetch it
  useState(() => {
    dispatch(fetchBatchList());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Glove Monitoring Dashboard
        </h1>

        {batches.length === 0 && (
          <p className="text-gray-500 text-sm italic text-center">
            No batches available. Please load or add data.
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch) => {
            const total = batch.steps?.length || 0;
            const completed = batch.steps?.filter((s) => s.saved)?.length || 0;
            const percent =
              total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={batch.gloveBatchId}
                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      Batch #{batch.gloveBatchId}
                    </h2>
                    <p className="text-xs text-gray-400">
                      Created: {batch.createdDate}
                    </p>
                  </div>
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
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      percent === 100
                        ? "bg-green-500"
                        : percent > 0
                        ? "bg-yellow-400"
                        : "bg-gray-300"
                    }`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <p>
                    {completed} / {total} Steps Saved
                  </p>
                  <p>{percent}%</p>
                </div>

                {/* View Details */}
                <button
                  onClick={() =>
                    setExpandedBatch(
                      expandedBatch === batch.gloveBatchId
                        ? null
                        : batch.gloveBatchId
                    )
                  }
                  className="mt-4 w-full text-sm text-blue-600 font-medium hover:underline flex items-center justify-center gap-1"
                >
                  {expandedBatch === batch.gloveBatchId
                    ? "▲ Hide Details"
                    : "▼ View Details"}
                </button>

                {/* Expandable Details */}
                {expandedBatch === batch.gloveBatchId && (
                  <div className="mt-4 border-t pt-3 space-y-3 animate-fadeIn">
                    {batch.steps.map((step, idx) => {
                      const status = step.saved
                        ? "Completed"
                        : "Not Saved";
                      return (
                        <div
                          key={idx}
                          className={`text-sm p-3 rounded-lg ${
                            step.saved
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          <div className="flex justify-between">
                            <p className="font-medium">
                              Step {idx + 1}
                            </p>
                            <p className="text-xs italic">{status}</p>
                          </div>

                          {/* Optional Step Data */}
                          {step.data && (
                            <div className="mt-2 text-xs text-gray-700 bg-gray-100 rounded-lg p-2">
                              {Object.entries(step.data).map(
                                ([key, value], i) => (
                                  <div
                                    key={i}
                                    className="flex justify-between border-b border-gray-200 py-1"
                                  >
                                    <span className="capitalize text-gray-600">
                                      {key.replace(/([A-Z])/g, " $1")}
                                    </span>
                                    <span className="font-medium text-gray-800">
                                      {value?.toString() || "—"}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
