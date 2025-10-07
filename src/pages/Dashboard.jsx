import { useEffect, useState } from "react";
import DashboardUpdates from "../components/DashboardUpdates";
import BatchList from "../components/BatchList";
import { FaPlus } from "react-icons/fa";
import BottomDrawer from "../components/BottomDrawer";
import { useSelector, useDispatch } from "react-redux";
import { useSettings } from "../hooks/useSettings";
import { fetchBatchList } from "../store/batchListSlice";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [settings, saveSettings] = useSettings({
    batchLs: [],
    activeBatch: {},
  });
  const batchList = useSelector((state) => state.batchList);

  // Fetch once on mount if empty
  useEffect(() => {
    if (batchList.batchLs.length === 0) {
      dispatch(fetchBatchList());
    }
  }, [batchList.batchLs.length, dispatch]);

  // Save to DB only when batchList changes meaningfully
  useEffect(() => {
    // Optional: add conditions so saveSettings isn't called redundantly
    saveSettings(batchList);
  }, [batchList, saveSettings]);

  return (
    <>
      <div className="px-4 py-1 bg-blue-100 rounded-lg">
        <p className="text-gray-500 text-sm">Welcome back</p>
        <h2 className="text-lg font-bold">Test User</h2>
      </div>
      <DashboardUpdates />
      <BatchList batchList={batchList.batchLs} />
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
        batchList={batchList.batchLs}
      />
    </>
  );
}
