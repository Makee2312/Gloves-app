import { useSelector } from "react-redux";
import { getBatchStatus } from "../reusables/getBatchStatus";
import { Layers, CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function DashboardUpdates({ searchText, setSearchText }) {
  const batchList = useSelector((state) => state.batchList.batchLs);

  function setBatches(value) {
    if (setSearchText) setSearchText(value);
  }

  const cardBase =
    "p-1 rounded-xl text-white shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer border-2 flex flex-col items-center justify-center";
  const iconBase = "w-7 h-7 animate-spin-slow";
  return (
    <div className="top-0 z-10 mb-2 mt-2 rounded-2xl bg-gradient-to-r from-blue-0 via-blue-50 to-white shadow-lg border border-blue-100 px-2 py-2">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        {/* 🧮 Total Batches */}
        <div
          onClick={() => setBatches("")}
          className={`${cardBase} bg-gradient-to-br from-blue-100 to-blue-200 ${
            searchText === ""
              ? "border-blue-400 border scale-105"
              : "border-transparent"
          }`}
        >
          <div className="flex w-full items-center justify-center gap-6">
            <Layers className={iconBase + " text-blue-700"} />
            <div className="text-left">
              <h3 className="text-xl text-blue-700 font-bold drop-shadow-sm">
                {batchList.length}
              </h3>
              <p className="text-sm mt-1 font-semibold text-blue-700 font-medium tracking-wide">
                Total Batches
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Completed */}
        <div
          onClick={() => setBatches("Completed")}
          className={`${cardBase} bg-gradient-to-br from-green-100 to-green-200 ${
            searchText === "Completed"
              ? "border-green-400 border scale-105"
              : "border-transparent"
          }`}
        >
          <div className="flex w-full items-center justify-center gap-6">
            <CheckCircle2 className={iconBase + "  text-green-700"} />
            <div className="text-left">
              <h3 className="text-xl  text-green-700 font-bold drop-shadow-sm">
                {batchList?.filter((bat) => getBatchStatus(bat) === "Completed")
                  .length || 0}
              </h3>
              <p className="text-sm mt-1 text-green-700  font-medium tracking-wide">
                Completed
              </p>
            </div>
          </div>
        </div>

        {/* ❌ Failed */}
        <div
          onClick={() => setBatches("QC Failed")}
          className={`${cardBase} bg-gradient-to-br from-red-100 to-red-200 ${
            searchText === "QC Failed"
              ? "border-red-400 border scale-105"
              : "border-transparent"
          }`}
        >
          <div className="flex w-full items-center justify-center gap-6">
            <XCircle className={iconBase + " text-red-700"} />
            <div className="text-left  w-[85px]">
              <h3 className="text-xl text-red-700  font-bold drop-shadow-sm">
                {batchList?.filter((bat) => getBatchStatus(bat) === "QC Failed")
                  .length || 0}
              </h3>
              <p className="text-sm mt-1 text-red-700 font-medium tracking-wide">
                Failed
              </p>
            </div>
          </div>
        </div>

        {/* ⚙️ In Progress */}
        <div
          onClick={() => setBatches("In")}
          className={`${cardBase} bg-gradient-to-br from-yellow-100 to-yellow-200 ${
            searchText === "In"
              ? "border-yellow-400 border scale-105"
              : "border-transparent"
          }`}
        >
          <div className="flex w-full items-center justify-center gap-6">
            <Loader2 className={iconBase + " text-yellow-700 "} />
            <div className="text-left">
              <h3 className="text-xl text-yellow-700  font-bold drop-shadow-sm">
                {batchList?.filter(
                  (bat) =>
                    getBatchStatus(bat) === "In progress" ||
                    getBatchStatus(bat) === "In QC"
                ).length || 0}
              </h3>
              <p className="text-sm mt-1 text-yellow-700 tracking-wide">
                In Progress
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
