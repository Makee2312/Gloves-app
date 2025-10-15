import React from "react";
import Header from "../reusables/Header";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Footer from "../reusables/footer";
import { fetchBatchList } from "../store/batchListSlice";
import { useDispatch } from "react-redux";

export default function Layout() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchBatchList());
  }, [dispatch]);
  return (
    <div className="min-h-screen mb-0 flex flex-col">
      {/* Sticky Header */}
      <Header />

      {/* Main content grows to fill available space */}
      <main className="flex-1 p-4 mb-4 bg-white">
        <Outlet />
      </main>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  );
}
