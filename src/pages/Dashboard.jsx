import React from "react";
import DashboardUpdates from "../components/DashboardUpdates";
import BatchList from "../components/BatchList";
import { FaPlus } from "react-icons/fa";

export default function Dashboard() {
  return (
    <>
      <DashboardUpdates />
      <BatchList /> {/* Floating Button */}
      <button className="fixed bottom-20 right-5 bg-cyan-400 p-4 rounded-full text-white shadow-lg">
        <FaPlus />
      </button>
    </>
  );
}
