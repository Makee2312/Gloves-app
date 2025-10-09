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
      <div className="px-4 py-1 bg-blue-100 rounded-lg">
        <p className="text-gray-500 text-sm">Welcome back</p>
        <h2 className="text-lg font-bold">Test User</h2>
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
