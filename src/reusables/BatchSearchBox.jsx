import { useEffect, useState } from "react";
import { Search, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BatchSearchBox({
  batchesList = [],
  activeBatch,
  setActiveBatch,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [filteredList, setFilteredList] = useState(batchesList);

  useEffect(() => {
    setFilteredList(
      activeBatch
        ? batchesList.filter((batch) =>
            batch.gloveBatchId.toString().includes(activeBatch)
          )
        : batchesList
    );
  }, [activeBatch]);
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Search Bar */}
      <div
        className={`flex items-center gap-2 border rounded-full px-4 py-2 mx-2 my-2 transition-all duration-200 ${
          isFocused ? "border-blue-500 shadow-md" : "border-gray-300"
        }`}
      >
        <Search className=" w-4 h-4 text-gray-400" />
        <input
          placeholder="Search here..."
          value={activeBatch}
          onChange={(e) => setActiveBatch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)} // delay to allow item click
          className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
        />
        <Settings className="w-4 h-4 text-gray-400" />
      </div>

      {/* Dropdown List */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
          >
            {filteredList
              ? filteredList.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveBatch(item.gloveBatchId);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <span className="font-bold">Batch: </span>
                    {item.gloveBatchId}
                  </button>
                ))
              : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
