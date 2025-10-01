import React from "react";
import Header from "../reusables/Header";
import { Outlet } from "react-router-dom";
import Footer from "../reusables/footer";

export default function Layout() {
  return (
    <div className="min-h-screen my-4 flex flex-col">
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
