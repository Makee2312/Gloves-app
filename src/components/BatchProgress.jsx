import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBatchList } from "../store/batchListSlice";
import { Search, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getBatchStatus, getBatchColor, qcFalseVariables } from "../reusables/getBatchStatus";
import { motion, AnimatePresence } from "framer-motion";

export default function BatchProgress() {
  const location = useLocation();
  const { activeBatchId } = location.state || {};
  const dispatch = useDispatch();

  const batches = useSelector((state) => state.batchList?.batchLs || []);

  const [selectedBatch, setSelectedBatch] = useState(activeBatchId || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    dispatch(fetchBatchList());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBatches([]);
      setFocusedIndex(-1);
    } else {
      const filtered = batches.filter((batch) =>
        batch.gloveBatchId?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBatches(filtered);
      setFocusedIndex(filtered.length > 0 ? 0 : -1);
    }
  }, [searchTerm, batches]);

  const handleKeyDown = useCallback(
    (e) => {
      if (filteredBatches.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev < filteredBatches.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredBatches.length - 1));
      } else if (e.key === "Enter" && focusedIndex >= 0) {
        e.preventDefault();
        handleSelect(filteredBatches[focusedIndex].gloveBatchId);
      } else if (e.key === "Escape") {
        setFilteredBatches([]);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    },
    [filteredBatches, focusedIndex]
  );

  useEffect(() => {
    if (resultsRef.current && focusedIndex >= 0) {
      const focusedElement = resultsRef.current.querySelectorAll("button")[focusedIndex];
      focusedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  const handleSelect = (batchId) => {
    setSelectedBatch(batchId);
    setSearchTerm("");
    setFilteredBatches([]);
    setFocusedIndex(-1);
    setActiveStepIndex(0); // Reset to first step on batch change
    inputRef.current?.blur();
  };

  const currentBatch = batches.find((b) => b.gloveBatchId === selectedBatch);
  const steps = currentBatch?.steps || [];
  const activeStep = steps[activeStepIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with batch title and search */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-extrabold text-slate-900 select-none">
            {selectedBatch ? `Monitoring Batch #${selectedBatch}` : "Select a Batch to Monitor"}
          </h1>

          <div className="relative w-full sm:w-72">
            <label htmlFor="batchSearch" className="sr-only">
              Search batch
            </label>
            <div className="flex items-center bg-white rounded-lg shadow-md border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 px-3 py-2">
              <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" aria-hidden="true" />
              <input
                id="batchSearch"
                type="search"
                placeholder="Search batch..."
                className="w-full text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                aria-autocomplete="list"
                aria-controls="searchResults"
                aria-activedescendant={
                  focusedIndex >= 0 ? `search-result-${filteredBatches[focusedIndex]?.gloveBatchId}` : undefined
                }
                role="combobox"
                aria-expanded={filteredBatches.length > 0}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredBatches([]);
                    setFocusedIndex(-1);
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <AnimatePresence>
              {filteredBatches.length > 0 && (
                <motion.div
                  id="searchResults"
                  role="listbox"
                  ref={resultsRef}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none"
                >
                  {filteredBatches.map((batch, index) => (
                    <button
                      key={batch.gloveBatchId}
                      id={`search-result-${batch.gloveBatchId}`}
                      role="option"
                      aria-selected={selectedBatch === batch.gloveBatchId}
                      onClick={() => handleSelect(batch.gloveBatchId)}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${focusedIndex === index
                          ? "bg-indigo-100 text-indigo-900"
                          : selectedBatch === batch.gloveBatchId
                            ? "font-semibold text-indigo-700"
                            : "text-gray-700 hover:bg-indigo-50"
                        }`}
                    >
                      Batch #{batch.gloveBatchId}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {!selectedBatch ? (
          <div className="flex justify-center items-center h-40 text-gray-500 text-center px-4">
            No batch selected. Please choose a batch from the list or search above.
          </div>
        ) : (
          <div>
            {/* Status & Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 select-none">
                  Batch #{currentBatch.gloveBatchId}
                </h2>
                <p className="text-xs text-gray-400 select-text">Created: {currentBatch.createdDate}</p>
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

            <div
              className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={
                currentBatch.steps?.filter((s) => s.saved)?.length === currentBatch.steps?.length
                  ? 100
                  : (100 * (currentBatch.steps?.filter((s) => s.saved)?.length || 0)) / (currentBatch.steps?.length || 1)
              }
            >
              <motion.div
                className={`h-3 rounded-full ${currentBatch.steps?.filter((s) => s.saved)?.length === currentBatch.steps?.length
                    ? "bg-green-500"
                    : "bg-yellow-400"
                  }`}
                initial={{ width: 0 }}
                animate={{
                  width: `${(100 * (currentBatch.steps?.filter((s) => s.saved)?.length || 0)) / (currentBatch.steps?.length || 1)
                    }%`,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>

            {/* Step tabs */}
            <div className="border-b border-gray-200 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <nav className="-mb-px flex space-x-4" aria-label="Step Tabs">
                {steps.map((step, idx) => {
                  const isActive = idx === activeStepIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveStepIndex(idx)}
                      aria-selected={isActive}
                      role="tab"
                      tabIndex={isActive ? 0 : -1}
                      className={`whitespace-nowrap py-3 px-4 text-sm font-medium rounded-t-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isActive
                          ? "border-indigo-500 border-b-2 text-indigo-700 bg-indigo-50"
                          : "border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-300"
                        }`}
                    >
                      Step {idx + 1}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Active step content */}
            <AnimatePresence mode="wait" initial={false}>
              {activeStep && (
                <motion.section
                  key={activeStepIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  aria-live="polite"
                  aria-label={`Step ${activeStepIndex + 1} details`}
                  role="tabpanel"
                >
                  <article
                    className="rounded-xl bg-white shadow-md border border-gray-300 p-6"
                    tabIndex={0}
                  >
                    <header className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        <span className="text-indigo-700 uppercase">{activeStep.processType}</span>
                      </h3>
                      <time
                        className={`text-sm font-medium italic ${activeStep.saved ? "text-green-700" : "text-gray-500"
                          }`}
                      >
                        {activeStep.saved ? "Completed" : "Not Saved"}
                        <br />
                        {activeStep.saved_date ?? "-"}
                      </time>
                    </header>
                    <div
                      className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${activeStep.processType === "qc" ? "bg-teal-50 p-4 rounded-lg" : ""
                        }`}
                    >
                      {Object.entries(activeStep.data).map(([key, value]) => {
                        if (activeStep.processType === "qc") {
                          const results = value.results ?? {};
                          return (
                            <div key={`${activeStep.processType}-${key}`} className="space-y-3">
                              <h4 className="font-semibold text-gray-700">{value.type}</h4>
                              {Object.entries(results).map(([k, v]) => {
                                const qcFailed = qcFalseVariables.some(
                                  (falseKey) =>
                                    (k === falseKey &&
                                      ((typeof v === "number" && v > 0) ||
                                        (typeof v === "string" && v.toLowerCase() === "fail"))) ||
                                    false
                                );
                                return (
                                  <div
                                    key={`${v}-${k}`}
                                    className={`rounded-lg p-4 shadow-sm border ${qcFailed
                                        ? "bg-red-200 border-red-400"
                                        : "bg-white border-gray-300"
                                      }`}
                                    aria-live={qcFailed ? "assertive" : undefined}
                                  >
                                    <span className="capitalize font-medium text-gray-600">
                                      {k.replace(/([A-Z])/g, " $1")}:
                                    </span>{" "}
                                    <span className="font-semibold text-gray-800">{v?.toString() ?? "—"}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        } else {
                          return (
                            <div
                              key={`${activeStep.processType}-${key}`}
                              className="rounded-lg p-4 shadow-sm border border-gray-300 bg-white"
                            >
                              <span className="capitalize font-medium text-gray-600">
                                {key.replace(/([A-Z])/g, " $1")}:
                              </span>{" "}
                              <span className="font-semibold text-gray-800">{value?.toString() ?? "—"}</span>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </article>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
