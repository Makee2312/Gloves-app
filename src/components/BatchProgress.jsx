import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBatchList, setActiveBatch } from "../store/batchListSlice";
import BatchSearchBox from "../reusables/BatchSearchBox";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getBatchStatus,
  getBatchColor,
  qcFalseVariables,
} from "../reusables/getBatchStatus";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* -------------------- helpers (retain your logic) -------------------- */

function detectQcFailures(batch) {
  const result = { totalFails: 0, failByStep: {}, failDetails: [] };
  (batch.steps || []).forEach((step) => {
    if (step.processType === "qc") {
      const arr = Array.isArray(step.data) ? step.data : [];
      arr.forEach((block) => {
        const results = block.results || {};
        Object.entries(results).forEach(([k, v]) => {
          const sval = String(v ?? "").toLowerCase();
          if (sval === "fail") {
            result.totalFails += 1;
            result.failByStep[step.processType] =
              (result.failByStep[step.processType] || 0) + 1;
            if (!result.failDetails.some((f) => f.field === k)) {
              result.failDetails.push({
                batchId: batch.gloveBatchId,
                step: step.processType,
                field: k,
                value: v,
              });
            }
          }
          if (
            k.toLowerCase().includes("fail") ||
            k.toLowerCase().includes("failcount") ||
            k.toLowerCase().includes("fail_count")
          ) {
            const n =
              parseInt(String(v || "0").replace(/\D/g, "") || "0", 10) || 0;
            if (n > 0) {
              result.totalFails += n;
              result.failByStep[step.processType] =
                (result.failByStep[step.processType] || 0) + n;
              if (!result.failDetails.some((f) => f.field === k)) {
                result.failDetails.push({
                  batchId: batch.gloveBatchId,
                  step: step.processType,
                  field: k,
                  value: v,
                });
              }
            }
          }
          if (qcFalseVariables && Array.isArray(qcFalseVariables)) {
            qcFalseVariables.forEach((falseKey) => {
              if (k === falseKey) {
                // Convert "1", "05" → 1, 5 for numeric comparisons
                const numericValue =
                  typeof v === "string" && !isNaN(v.trim()) ? parseFloat(v.trim()) : v;

                const isFailed =
                  (typeof numericValue === "number" && numericValue > 0) ||
                  (typeof v === "string" && v.toLowerCase() === "fail");

                if (isFailed) {
                  result.totalFails += 1;
                  result.failByStep[step.processType] =
                    (result.failByStep[step.processType] || 0) + 1;

                  // Avoid duplicate fail details for the same field
                  if (!result.failDetails.some((f) => f.field === k)) {
                    result.failDetails.push({
                      batchId: batch.gloveBatchId,
                      step: step.processType,
                      field: k,
                      value: v,
                    });
                  }
                }
              }
            });
          }
        });
      });
    }
  });
  return result;
}

function extractGlovesCount(batch) {
  const qcStep = (batch.steps || []).find((s) => s.processType === "qc");
  if (!qcStep) return 0;
  const dataArr = Array.isArray(qcStep.data) ? qcStep.data : [];
  const keysPriority = [
    "waterTightnessPassCount",
    "waterTightnessPasscount",
    "passCount",
    "pass_count",
    "pass",
    "passed",
    "glovesPassed",
    "glovesPassCount",
  ];
  for (const block of dataArr) {
    const results = block.results || {};
    for (const key of keysPriority) {
      if (typeof results[key] !== "undefined") {
        const val =
          parseInt(String(results[key] || "0").replace(/\D/g, ""), 10) || 0;
        if (val > 0) return val;
      }
    }
    const numericVals = Object.values(results)
      .map((v) => parseInt(String(v || "").replace(/\D/g, ""), 10) || 0)
      .filter((n) => n > 0)
      .sort((a, b) => b - a);
    if (numericVals.length) return numericVals[0];
  }
  return 0;
}

function getNextStepIndex(batch) {
  const idx = (batch.steps || []).findIndex((s) => !s.saved);
  return idx === -1 ? null : idx;
}

function prettyStepName(step) {
  if (!step) return "--";
  return (step.processType || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());
}

/* -------------------- Main component -------------------- */

export default function BatchProgress() {
  const location = useLocation();
  const { activeBatchId } = location.state || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const batches = useSelector((state) => state.batchList?.batchLs || []);
  const [selectedBatch, setSelectedBatch] = useState(activeBatchId || null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchBatchList());
  }, [dispatch]);

  // derived lists
  const qcFailedBatches = useMemo(() => {
    return (batches || [])
      .map((b) => {
        const d = detectQcFailures(b);
        return { batch: b, qcInfo: d, gloves: b.batchCount };
      })
      .filter((x) => x.qcInfo.totalFails > 0);
  }, [batches]);

  const inProgressBatches = useMemo(() => {
    return (batches || [])
      .map((b) => {
        const nextIdx = getNextStepIndex(b);
        const nextStep = nextIdx === null ? null : b.steps[nextIdx];
        return { batch: b, nextIdx, nextStep, gloves: b.batchCount };
      })
      .filter(
        (x) =>
          x.nextIdx !== null &&
          !((x.batch.status || "").toLowerCase() === "completed")
      );
  }, [batches]);

  const completedBatches = useMemo(() => {
    return (batches || [])
      .filter((b) => getBatchStatus(b).toLowerCase() === "completed")
      .map((b) => ({ batch: b, gloves: b.batchCount }));
  }, [batches]);

  // keep original behaviour and data for the main below section
  const currentBatch =
    batches.find((b) => b.gloveBatchId === selectedBatch) || {};
  const steps = currentBatch?.steps || [];
  const activeStep = steps[activeStepIndex];
  const progressStatus = currentBatch.status === "Completed";

  // handle selecting a batch from QC failed or completed lists:
  const handleBatchSelect = (batchId, focusStepIndex = 0) => {
    setSelectedBatch(batchId);
    setActiveStepIndex(typeof focusStepIndex === "number" ? focusStepIndex : 0);
    // scroll to the details area below
    setTimeout(() => {
      const el = document.getElementById("batch-detail-view");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 80);
  };

  // small Card helper
  const Card = ({ children, className = "" }) => (
    <div
      className={`rounded-xl bg-white shadow-sm border border-gray-100 p-3 ${className}`}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-3 px-3 sm:px-6 lg:px-8 mb-12">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* ----------------- Continuous Monitoring Dashboard (MOBILE-FIRST) ----------------- */}
        <section className="space-y-3">
          {/* QC Failed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">
                QC Failed Batches
              </h3>
              <div className="text-xs text-gray-400">
                {qcFailedBatches.length} batches
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {qcFailedBatches.length === 0 && (
                <div className="text-xs text-gray-500">
                  No QC failures detected.
                </div>
              )}

              {qcFailedBatches.map(({ batch, qcInfo, gloves }) => {
                const failList = qcInfo?.failDetails || [];
                const qcIndex = (batch.steps || []).findIndex(
                  (s) => s.processType === "qc"
                );

                // Handle click to show details in search bar below
                const handleQcFailedClick = () => {
                  setSelectedBatch(batch.gloveBatchId);
                  setActiveStepIndex(qcIndex !== -1 ? qcIndex : 0);
                  dispatch(setActiveBatch(batch));
                  setTimeout(() => {
                    document
                      .getElementById("batch-detail-view")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }, 80);
                };

                return (
                  <div
                    key={batch.gloveBatchId}
                    className="min-w-[280px] flex-shrink-0"
                    onClick={handleQcFailedClick}
                    role="button"
                    tabIndex={0}
                  >
                    <Card className="cursor-pointer hover:shadow-md active:scale-[0.99] transition-transform">
                      {/* Header */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="text-sm font-semibold text-gray-800">
                            Batch #{batch.gloveBatchId}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {batch.createdDate}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Gloves</div>
                          <div className="text-sm font-semibold">
                            {gloves || "—"}
                          </div>
                        </div>
                      </div>

                      {/* Fail details */}
                      <div className="mt-3 border-t border-gray-100 pt-3">
                        <div className="text-xs text-gray-500 mb-1">
                          {failList.length > 0
                            ? `${failList.length} failure${failList.length > 1 ? "s" : ""
                            }`
                            : "No details available"}
                        </div>

                        {failList.length > 0 ? (
                          <ul className="max-h-32 overflow-y-auto pr-1 space-y-1">
                            {failList
                              .filter(
                                (fail, index, self) =>
                                  index ===
                                  self.findIndex(
                                    (f) =>
                                      f.field === fail.field &&
                                      f.value === fail.value
                                  )
                              )
                              .map((fail, i) => (
                                <li
                                  key={i}
                                  className="flex items-center justify-between gap-2 bg-red-50 text-red-800 rounded-md px-2 py-1"
                                >
                                  <span className="capitalize text-[11px] font-medium">
                                    {fail.field.replace(/([A-Z])/g, " $1")}
                                  </span>
                                  <span className="text-[11px] font-semibold">
                                    {String(fail.value)}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        ) : (
                          <div className="text-xs text-gray-500">
                            No QC fail fields detected.
                          </div>
                        )}

                        <div className="mt-2 text-[11px] text-gray-500">
                          Tap to open QC details
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* In Progress */}

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">
                In Progress — Needs action
              </h3>
              <div className="text-xs text-gray-400">
                {inProgressBatches.length} batches
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {inProgressBatches.length === 0 && (
                <div className="text-xs text-gray-500">
                  No in-progress batches.
                </div>
              )}

              {inProgressBatches.map(({ batch, nextIdx, nextStep, gloves }) => {
                const stepLabel = nextStep
                  ? prettyStepName(nextStep)
                  : "Complete";

                const handleCardClick = () => {
                  const derivedStatus = getBatchStatus(batch);
                  console.log("Derived status:", derivedStatus);

                  // ✅ Update local + redux state before navigation
                  setSelectedBatch(batch.gloveBatchId);
                  setActiveStepIndex(nextIdx ?? 0);
                  dispatch(setActiveBatch(batch));

                  if (derivedStatus === "In QC") {
                    navigate("/qc", {
                      state: { activeBatchId: batch.gloveBatchId },
                    });
                  } else {
                    navigate("/latexInput", {
                      state: {
                        batchData: batch,
                        viewOnly: !!batch.isFinished, // viewOnly true if completed
                      },
                    });
                  }

                  // ✅ Optional smooth scroll to details view (useful if you stay on same page)
                  setTimeout(() => {
                    document
                      .getElementById("batch-detail-view")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }, 80);
                };

                return (
                  <div
                    key={batch.gloveBatchId}
                    className="min-w-[260px] flex-shrink-0"
                  >
                    <div onClick={handleCardClick}>
                      <Card className="cursor-pointer hover:shadow-md active:scale-[0.99] transition-transform">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="text-sm font-semibold text-gray-800">
                              Batch #{batch.gloveBatchId}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {batch.createdDate}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs text-gray-500">Gloves</div>
                            <div className="text-sm font-semibold text-gray-800">
                              {gloves || "—"}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 border-t border-gray-100 pt-3">
                          <div className="text-[12px] text-amber-700 font-semibold">
                            Stopped at
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                            <div className="text-sm font-medium">
                              {stepLabel}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const derivedStatus = getBatchStatus(batch);
                                console.log(derivedStatus);
                                if (derivedStatus == "In QC") {
                                  navigate("/qc", {
                                    state: {
                                      activeBatchId: batch.gloveBatchId,
                                    },
                                  });
                                } else {
                                  dispatch(setActiveBatch(batch));
                                  console.log(batch);
                                  navigate("/latexinput", {
                                    state: {
                                      batchData: batch,
                                      viewOnly: !!batch.isFinished,
                                    },
                                  });
                                }
                              }}
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                              Continue <ArrowRight size={14} />
                            </button>
                          </div>
                          <div className="mt-2 text-[11px] text-gray-500">
                            Tap Continue to open input screen
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Completed Batches
              </h3>
              <div className="text-xs text-gray-400">
                {completedBatches.length} batches
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {completedBatches.length === 0 && (
                <div className="text-xs text-gray-500">
                  No completed batches yet.
                </div>
              )}
              {completedBatches.map(({ batch, gloves }) => (
                <div key={batch.gloveBatchId}>
                  <div onClick={() => handleBatchSelect(batch.gloveBatchId, 0)}>
                    <Card className="cursor-pointer hover:shadow-md active:scale-[0.99] transition-transform">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-semibold text-gray-800">
                            #{batch.gloveBatchId}
                          </div>
                          <div className="text-xs text-gray-400">
                            {batch.createdDate}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Gloves</div>
                          <div className="text-sm font-semibold">
                            {gloves || "—"}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------- Existing Search & Main UI (unchanged logic & flow) ----------------- */}
        <div id="batch-detail-view">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
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
            <div className="flex justify-center items-center h-40 text-gray-500 text-center px-4 mt-8 ">
              No batch selected for monitoring.
            </div>
          ) : (
            <>
              {/* Status & Progress */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 mt-4">
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
                        (currentBatch.steps?.filter((s) => s.saved)?.length ||
                          0)) /
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
                        (currentBatch.steps?.filter((s) => s.saved)?.length ||
                          0)) /
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

              {/* Active Step Content (same layout & logic) */}
              <AnimatePresence mode="wait" initial={false}>
                {activeStep && (
                  <motion.section
                    key={activeStepIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <article className="rounded-xl bg-white shadow-md border border-gray-200 p-2 transition-all hover:shadow-lg">
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

                      {/* Step Data */}
                      <div
                        className={`grid ${activeStep.processType === "qc"
                          ? "grid-cols-1"
                          : "grid-cols-2"
                          } gap-2 m-0 p-0`}
                      >
                        {Object.entries(activeStep.data).map(([key, value]) => {
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

                                      (falseKey) => {
                                        if (k !== falseKey) return false;

                                        const numericValue =
                                          typeof v === "string" && !isNaN(v.trim()) ? parseFloat(v.trim()) : v;

                                        return (
                                          (typeof numericValue === "number" && numericValue > 0) ||
                                          (typeof v === "string" && v.toLowerCase() === "fail")
                                        );
                                      });

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
                                          className={`font-semibold text-[10px] ${qcFailed
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
    </div>
  );
}
