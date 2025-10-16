import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import { useDispatch } from "react-redux";
import { setActiveBatch } from "../store/batchListSlice";
import { getBatchStatus, getBatchColor } from "../reusables/getBatchStatus";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { renderLegend } from "../reusables/customLegend";

export default function BatchList({ batchList, searchText, setSearchText }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sortOption, setSortOption] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [batchesWithStatus, setBatchesWithStatus] = useState([]);

  useEffect(() => {
    if (batchList) {
      const processed = batchList.map((batch) => ({
        ...batch,
        derivedStatus: getBatchStatus(batch),
        isFinished:
          batch.steps && batch.steps.every((step) => step.saved === true),
      }));
      setBatchesWithStatus(processed);
    }
  }, [batchList]);

  const filteredBatches = useMemo(() => {
    return batchesWithStatus.filter(
      (batch) =>
        batch.gloveBatchId
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        batch.derivedStatus
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase())
    );
  }, [searchText, batchesWithStatus]);

  const sortedBatches = useMemo(() => {
    const sorted = [...filteredBatches];
    switch (sortOption) {
      case "Oldest":
        sorted.sort(
          (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
        );
        break;
      case "Status":
        sorted.sort((a, b) => a.derivedStatus.localeCompare(b.derivedStatus));
        break;
      case "Batch ID":
        sorted.sort((a, b) => a.gloveBatchId - b.gloveBatchId);
        break;
      default:
        sorted.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
    }
    return sorted;
  }, [sortOption, filteredBatches]);

  const totalPages = Math.ceil(sortedBatches.length / itemsPerPage);
  const paginatedBatches = sortedBatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const STATUS_COLORS = {
    Completed: "#10B981", // green
    "In Progress": "#FACC15", // yellow
    "In QC": "#EC4899", // pink
    "QC Failed": "#EF4444", // red
    "Yet to start": "#9CA3AF", // gray
    Unknown: "#D1D5DB", // light gray fallback
  };

  const chartData = useMemo(() => {
    const statusCounts = {};
    batchesWithStatus.forEach((b) => {
      const status = b.derivedStatus || "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.keys(statusCounts).map((key) => ({
      name: key,
      value: statusCounts[key],
      color: STATUS_COLORS[key] || STATUS_COLORS.Unknown,
    }));
  }, [batchesWithStatus]);

  return (
    <div className="flex flex-col w-full h-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-10 py-4">
      {/* Chart Section */}
      <div className="w-full mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
          Batch Status Overview
        </h2>
        <div className="bg-white border rounded-2xl shadow p-3 sm:p-5">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="70%"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend content={renderLegend} />;
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search + Sort Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {/* Search bar */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 w-full sm:w-1/2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            placeholder="Search by ID or status"
            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Sorting dropdown */}
        <div className="relative w-full sm:w-44 md:w-56 group">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="
        w-full text-sm  font-medium
        border border-gray-300
        rounded-full px-4 py-2.5 pr-10
        bg-white shadow-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        hover:border-gray-400
        transition-all duration-200
        cursor-pointer
        appearance-none
        text-gray-700
        bg-gradient-to-r from-gray-50 to-white
      "
          >
            <option
              value="Latest"
              className="bg-white text-gray-800 hover:bg-blue-50"
            >
              Latest
            </option>
            <option
              value="Oldest"
              className="bg-white text-gray-800 hover:bg-blue-50"
            >
              Oldest
            </option>
            <option
              value="Status"
              className="bg-white text-gray-800 hover:bg-blue-50"
            >
              Status
            </option>
            <option
              value="Batch ID"
              className="bg-white text-gray-800 hover:bg-blue-50"
            >
              Batch ID
            </option>
          </select>

          {/* Dropdown Icon */}
          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 
      text-gray-500 pointer-events-none 
      transition-transform duration-200 
      group-focus-within:rotate-180"
          />
        </div>
      </div>

      <div className="px-6 mt-5 text-sm font-semibold text-gray-600 grid grid-cols-2">
        <span>Batch list</span>
        <span className="text-right">Status &amp; date</span>
      </div>
      <div className="mt-2 mb-16 space-y-3 px-4 flex-1 overflow-y-auto">
        {paginatedBatches ? (
          paginatedBatches.map((batch) => (
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
        ) : (
          <p className="text-center text-gray-400 text-sm mt-10">
            No batches found
          </p>
        )}{" "}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 sm:gap-2 mt-5 flex-wrap">
            <button
              className="px-3 py-1 rounded-full border text-sm disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-full text-sm ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "border text-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded-full border text-sm disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
