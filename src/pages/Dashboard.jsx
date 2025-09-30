import { useState } from "react";
import DashboardUpdates from "../components/DashboardUpdates";
import BatchList from "../components/BatchList";
import { FaPlus } from "react-icons/fa";
import BottomDrawer from "../components/BottomDrawer";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [batchList, setBatchList] = useState([]);
  return (
    <>
      <DashboardUpdates />
      <BatchList batchList={batchList} setBatchList={setBatchList} />{" "}
      {/* Floating Button */}
      <button
        className="fixed bottom-20 right-5 bg-cyan-400 p-4 rounded-full text-white shadow-lg"
        onClick={() => setOpen(true)}
      >
        <FaPlus />
      </button>{" "}
      <BottomDrawer
        open={open}
        setOpen={setOpen}
        batchList={batchList}
        setBatchList={setBatchList}
      />
    </>
  );
}
