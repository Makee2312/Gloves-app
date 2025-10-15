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
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchBatches();
  }, []);

  return (
    <>
      <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl px-4 py-3 shadow-sm w-full transition">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
          TU
        </div>
        <div>
          <p className="text-gray-500 text-sm">Welcome back</p>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Test User
          </h2>
        </div>
      </div>
      <DashboardUpdates searchText={searchText} setSearchText={setSearchText} />
      {loading ? (
        <div>Loading....</div>
      ) : (
        <BatchList
          batchList={batchesList.batchLs}
          searchText={searchText}
          setSearchText={setSearchText}
        />
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
