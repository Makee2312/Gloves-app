import { useSelector } from "react-redux";
import { getBatchStatus } from "../reusables/getBatchStatus";

export default function DashboardUpdates() {
  const batchList = useSelector((state) => state.batchList.batchLs);
  return (
    <div className=" top-0 z-10 mb-4 mt-4 rounded-2xl bg-gradient-to-r from-blue-50 via-blue-100 to-white shadow-lg border border-blue-100 px-6 py-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl text-white shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1">
          <h3 className="text-3xl font-extrabold drop-shadow-sm">
            {batchList.length}
          </h3>
          <p className="text-sm mt-2 text-blue-100 font-medium tracking-wide">
            Total Batches
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-500 to-green-700 rounded-xl text-white shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1">
          <h3 className="text-3xl font-extrabold drop-shadow-sm">
            {batchList?.filter((bat) => getBatchStatus(bat) === "Completed")
              .length || 0}
          </h3>
          <p className="text-sm mt-2 text-green-100 font-medium tracking-wide">
            Completed
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-red-500 to-red-700 rounded-xl text-white shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1">
          <h3 className="text-3xl font-extrabold drop-shadow-sm">
            {batchList?.filter((bat) => getBatchStatus(bat) === "QC Failed")
              .length || 0}
          </h3>
          <p className="text-sm mt-2 text-red-100 font-medium tracking-wide">
            Failed
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl text-white shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1">
          <h3 className="text-3xl font-extrabold drop-shadow-sm">
            {batchList?.filter(
              (bat) =>
                getBatchStatus(bat) === "In progress" ||
                getBatchStatus(bat) === "In QC"
            ).length || 0}
          </h3>
          <p className="text-sm mt-2 text-blue-100 font-medium tracking-wide">
            In Progress
          </p>
        </div>
      </div>
    </div>
  );
}
