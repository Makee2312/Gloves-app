import React from "react"; // icons
import Header from "../reusables/Header";
import { Outlet } from "react-router-dom";
import Footer from "../reusables/footer";
export default function Layout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
      <Header />
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
