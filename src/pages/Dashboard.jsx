import { useState } from "react";
import DashboardUpdates from "../components/DashboardUpdates";
import BatchList from "../components/BatchList";
import { FaPlus } from "react-icons/fa";
import BottomDrawer from "../components/BottomDrawer";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  // const [batchList, setBatchList] = useState([]);
  const batchList = useSelector((state) => state.batchList.batchLs);

  return (
    <>
      <div className="px-4 py-1 bg-blue-100">
        <p className="text-gray-500 text-sm">Welcome back</p>
        <h2 className="text-lg font-bold">Test User</h2>
      </div>
      <DashboardUpdates />
      <BatchList batchList={batchList} />
      <button
        className="fixed bottom-20 right-5 bg-blue-600 p-4 rounded-full text-white shadow-lg"
        onClick={() => setOpen(true)}
      >
        <FaPlus />
      </button>{" "}
      <BottomDrawer open={open} setOpen={setOpen} batchList={batchList} />
    </>
  );
}
