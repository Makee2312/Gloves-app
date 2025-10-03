import { useSelector } from "react-redux";

function getBatchStatus(batch) {
  const steps = batch.steps || [];
  if (steps.length === 0) return "Yet to start";
  const allSaved = steps.every((step) => step.saved === true);
  if (allSaved) return "Completed";
  if (steps[0]?.saved === true) return "In progress";
  return "Yet to start";
}

export default function DashboardUpdates() {
  const batchList = useSelector((state) => state.batchList.batchLs);
  return (
    <div className="bg-gradient-to-r from-gray-500 to-gray-400 text-white  rounded-xl  grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4  gap-4 px-4 mt-4">
      <div className=" text-white rounded-xl p-2 text-center">
        <h3 className="text-2xl font-bold">{batchList.length}</h3>
        <p className="text-xs mt-1">Total batches</p>
      </div>
      <div className=" p-2 text-center">
        <h3 className="text-2xl font-bold">
          {batchList != null
            ? batchList.filter((bat) => getBatchStatus(bat) == "Completed")
                .length
            : 0}
        </h3>
        <p className="text-xs mt-1">Completed</p>
      </div>
      <div className="p-2 text-center">
        <h3 className="text-2xl font-bold">
          {batchList != null
            ? batchList.filter((bat) => getBatchStatus(bat) === "Failed").length
            : 0}
        </h3>
        <p className="text-xs mt-1">Failed</p>
      </div>
      <div className=" p-2 text-center">
        <h3 className="text-2xl font-bold">
          {batchList != null
            ? batchList.filter((bat) => getBatchStatus(bat) === "In progress")
                .length
            : 0}
        </h3>
        <p className="text-xs mt-1">In progress</p>
      </div>
    </div>
  );
}
