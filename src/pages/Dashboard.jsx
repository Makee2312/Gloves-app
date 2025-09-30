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
      <DashboardUpdates />
      <BatchList batchList={batchList} /> {/* Floating Button */}
      <button
        className="fixed bottom-20 right-5 bg-cyan-400 p-4 rounded-full text-white shadow-lg"
        onClick={() => setOpen(true)}
      >
        <FaPlus />
      </button>{" "}
      <BottomDrawer open={open} setOpen={setOpen} batchList={batchList} />
    </>
  );
}
