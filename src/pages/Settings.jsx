import { useState } from "react";
import FlowChart from "../components/FlowChart";

export default function Settings() {
  const [showFlowchart, setShowFlowchart] = useState(false);

  const handleOpenFlowchart = () => {
    setShowFlowchart(true);
  };

  const handleCloseFlowchart = () => {
    setShowFlowchart(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md font-sans">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        Settings
      </h1>

      {/* Settings Sections */}
      <div className="space-y-8">

        {/* Example Part: View Flowchart */}
        <section className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Visualizations
          </h2>
          <div className="flex justify-center">
            <button
              onClick={handleOpenFlowchart}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              View Flowchart
            </button>
          </div>
        </section>

        {/* Other settings parts can go here */}
        {/* Example: Account, Preferences, etc. */}
        {/* 
        <section className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Account</h2>
          // ... Account settings
        </section>
        */}

      </div>

      {/* Flowchart Modal */}
      {showFlowchart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full relative p-6">
            {/* Header with Close Button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Flowchart</h3>
              <button
                onClick={handleCloseFlowchart}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            {/* Flowchart Content */}
            <div className="overflow-auto max-h-[70vh]">
              <FlowChart />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
