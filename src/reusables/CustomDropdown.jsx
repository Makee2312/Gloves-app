import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomDropdown({
  items = [],
  onSelect,
  placeHolder = "Select",
}) {
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);

  const handleSelect = (value) => {
    setSelected(value);
    setOpen(false);
    console.log("Selected:", value);
    if (onSelect) onSelect(value); // ✅ call directly
  };

  return (
    <div className="relative inline-block text-left w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex justify-between items-center w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none transition"
      >
        <span>{selected || placeHolder}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {/* Dropdown Items */}
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <ul className="text-gray-700">
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                  selected === item ? "bg-gray-100 font-medium" : ""
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
