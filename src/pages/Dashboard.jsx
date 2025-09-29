import { useState } from "react";
import DashboardUpdates from "../components/DashboardUpdates";
import BatchList from "../components/BatchList";
import { FaPlus } from "react-icons/fa";
import BottomDrawer from "../components/BottomDrawer";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [batchList, setBatchList] = useState([
    {
      batch: 10001,
      batchStatus: "Completed",
      batchDate: "May 4th, 2025",
      batchDesc: "Dispatched successfully",
      count: 1,
    },
    {
      batch: 10002,
      batchStatus: "Failed",
      batchDate: "May 5th, 2025",
      batchDesc: "In Quality control",
      count: 1,
    },
    {
      batch: 10003,
      batchStatus: "In progress",
      batchDate: "May 5th, 2025",
      batchDesc: "In Dipping process",
      count: 1,
    },
    {
      batch: 10004,
      batchStatus: "Yet to start",
      batchDate: "May 6th, 2025",
      batchDesc: " - ",
      count: 1,
    },
  ]);
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
