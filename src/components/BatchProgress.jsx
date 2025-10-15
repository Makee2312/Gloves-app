import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBatchList } from "../store/batchListSlice";
import BatchSearchBox from "../reusables/BatchSearchBox";
import { useLocation } from "react-router-dom";
import { getBatchStatus, getBatchColor, qcFalseVariables } from "../reusables/getBatchStatus";
import { motion, AnimatePresence } from "framer-motion";

export default function BatchProgress() {
  const location = useLocation();
  const { activeBatchId } = location.state || {};
  const dispatch = useDispatch();

  const batches = useSelector((state) => state.batchList?.batchLs || []);
  const [selectedBatch, setSelectedBatch] = useState(activeBatchId || null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchBatchList());
  }, [dispatch]);

  const currentBatch = batches.find((b) => b.gloveBatchId === selectedBatch) || {};
  const steps = currentBatch?.steps || [];
  const activeStep = steps[activeStepIndex];
  const progressStatus = currentBatch.status === "Completed";

  return (
    <div className="min-h-screen mb-6 py-2 px-2 sm:px-4 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <BatchSearchBox
            batchesList={batches}
            activeBatch={selectedBatch}
            setActiveBatch={(batchId) => {
              setSelectedBatch(batchId);
              setActiveStepIndex(0);
            }}
          />
        </header>

        {!selectedBatch ? (
          <div className="flex justify-center items-center h-40 text-gray-500 text-center px-4">
            No batch selected for monitoring.
          </div>
        ) : (
          <>
            {/* Status & Progress */}
            <div className="flex flex-col-2 sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 select-none">
                  Batch #{currentBatch.gloveBatchId}
                </h2>
                <p className="text-xs text-gray-400 select-text">
                  Created: {currentBatch.createdDate}
                </p>
              </div>
              <div>
                {(() => {
                  const batchStatus = getBatchStatus(currentBatch);
                  return (
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold text-xs tracking-wide select-none ${getBatchColor(batchStatus) + " ring-1 ring-inset"
                        }`}
                      aria-label={`Batch status: ${batchStatus}`}
                    >
                      {batchStatus}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Progress Bar */}
            {!progressStatus && (
              <div
                className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={
                  currentBatch.steps?.filter((s) => s.saved)?.length ===
                    currentBatch.steps?.length
                    ? 100
                    : (100 *
                      (currentBatch.steps?.filter((s) => s.saved)?.length || 0)) /
                    (currentBatch.steps?.length || 1)
                }
              >

                <motion.div
                  className={`h-3 rounded-full ${currentBatch.steps?.filter((s) => s.saved)?.length ===
                      currentBatch.steps?.length
                      ? "bg-green-500"
                      : "bg-yellow-400"
                    }`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(100 *
                        (currentBatch.steps?.filter((s) => s.saved)?.length || 0)) /
                      (currentBatch.steps?.length || 1)
                      }%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            )}

            {/* Step Tabs */}
            <div className="border-b border-gray-200 mb-6 overflow-x-auto">
              <nav aria-label="Step Tabs" className="flex">
                {steps.map((step, idx) => {
                  const isActive = idx === activeStepIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveStepIndex(idx)}
                      aria-selected={isActive}
                      role="tab"
                      tabIndex={isActive ? 0 : -1}
                      className={`whitespace-nowrap py-3 px-3 text-xs font-medium rounded-lg ${isActive
                          ? "mt-2 mx-2 text-indigo-700 bg-indigo-100"
                          : "text-gray-600 hover:text-indigo-600 hover:border-indigo-300"
                        }`}
                    >
                      Step {idx + 1}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Active Step Content */}
            <AnimatePresence mode="wait" initial={false}>
              {activeStep && (
                <motion.section
                  key={activeStepIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <article className="rounded-xl bg-white shadow-md border border-gray-200 p-2  transition-all hover:shadow-lg">
                    {/* Step Header */}
                    <header className="flex flex-col-2 items-center justify-between mb-5 border-b border-gray-100 pb-2">
                      <div className="flex items-center gap-1">
                        <h3 className="text-md font-semibold text-gray-900 tracking-tight text-left">
                          <span className="text-indigo-700 font-bold">
                            {activeStep?.processType
                              ?.replace(/([A-Z])/g, " $1")
                              ?.replace(/^./, (s) => s.toUpperCase())}
                          </span>
                        </h3>
                      </div>

                      <div className="grid gap-1 text-right">
                        <span
                          className={`text-xs px-4 py-0.5 rounded-full font-medium ${activeStep.saved
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                            }`}
                        >
                          {activeStep.saved ? "Completed" : "Not Saved"}
                        </span>

                        <time className="text-xs sm:text-sm font-medium italic text-gray-500">
                          {activeStep.saved_date ?? "-"}
                        </time>
                      </div>
                    </header>

                    {/* Step Data (List / Table Style) */}
                    <div className={`grid ${activeStep.processType === "qc" ? "grid-cols-1" : "grid-cols-2"} gap-2 m-0 p-0`}>
                      {Object.entries(activeStep.data).map(([key, value]) => {
                        // QC layout
                        if (activeStep.processType === "qc") {
                          const results = value.results ?? {};
                          return (
                            <div
                              key={key}
                              className="w-full mb-5 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <h4 className="px-4 py-2 border-b border-gray-100 text-sm font-semibold text-gray-800 bg-gray-50 rounded-t-xl">
                                {value.type}
                              </h4>
                              <ul className="divide-y divide-gray-100">
                                {Object.entries(results).map(([k, v]) => {
                                  const qcFailed = qcFalseVariables.some(
                                    (falseKey) =>
                                      k === falseKey &&
                                      ((typeof v === "number" && v > 0) ||
                                        (typeof v === "string" &&
                                          v.toLowerCase() === "fail"))
                                  );
                                  return (
                                    <li
                                      key={k}
                                      className={`flex justify-between items-center px-4 py-2 text-sm sm:text-base transition-colors duration-150 ${qcFailed
                                          ? "bg-red-50 text-red-700 font-semibold border-l-4 border-red-400"
                                          : "hover:bg-indigo-50"
                                        }`}
                                    >
                                      <span className="capitalize font-medium text-[9px] text-gray-700">
                                        {k.replace(/([A-Z])/g, " $1")}
                                      </span>
                                      <span
                                        className={`font-semibold  text-[10px] ${qcFailed
                                            ? "text-red-700"
                                            : "text-gray-900"
                                          }`}
                                      >
                                        {v?.toString() ?? "—"}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        }

                        // Non-QC layout
                        return (
                          <div
                            key={key}
                            className="rounded-lg mb-1 p-1 overflow-hidden border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex justify-between items-center px-1 py-2 text-[9px]">
                              <span className="capitalize font-medium text-gray-700">
                                {key.replace(/([A-Z])/g, " $1")}
                              </span>
                              <span className="pl-1 text-[10px] text-gray-900">
                                {value?.toString() ?? "—"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                </motion.section>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
