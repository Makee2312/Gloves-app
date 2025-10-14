import { useEffect, useState } from "react";
import DashboardUpdates from "../components/DashboardUpdates";
import BatchList from "../components/BatchList";
import { FaPlus } from "react-icons/fa";
import BottomDrawer from "../components/BottomDrawer";
import { useSelector, useDispatch } from "react-redux";
import { useBatchData } from "../hooks/useBatchData";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const { batches, loading, fetchBatches, addBatch } = useBatchData();
  const batchesList = useSelector((state) => state.batchList);

  useEffect(() => {
    fetchBatches();
  }, []);

  return (
    <>
      <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 shadow-sm w-full transition">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
          TU
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Welcome back
          </p>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
            Test User
          </h2>
        </div>
      </div>
      <DashboardUpdates />
      {loading ? (
        <div>Loading....</div>
      ) : (
        <BatchList batchList={batchesList.batchLs} />
      )}
      <button
        className="fixed bottom-20 right-5 bg-blue-600 p-4 rounded-full text-white shadow-lg"
        onClick={() => {
          setOpen(true);
        }}
      >
        <FaPlus />
      </button>{" "}
      <BottomDrawer
        open={open}
        setOpen={setOpen}
        batchList={batchesList.batchLs}
      />
    </>
  );
}
