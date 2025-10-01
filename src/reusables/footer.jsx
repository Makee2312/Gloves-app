import { useState } from "react";
import {
  GrDashboard,
  GrMonitor,
  GrSettingsOption,
  GrTest,
} from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { id: 0, name: "Dashboard", icon: <GrDashboard />, route: "/" },
  { id: 1, name: "Monitor", icon: <GrMonitor />, route: "/progress" },
  { id: 2, name: "QC", icon: <GrTest />, route: "/qc" },
  { id: 3, name: "Settings", icon: <GrSettingsOption />, route: "/settings" },
];

export default function Footer() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 
                 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.1)] 
                 h-16 flex justify-around items-center"
    >
      {navItems.map((item) => {
        const isActive = active === item.id;
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setActive(item.id);
              navigate(item.route);
            }}
            className="relative flex flex-col items-center justify-center w-20"
          >
            {/* 🔵 Animated highlight square */}
            {isActive && (
              <motion.div
                layoutId="activeHighlight"
                className="absolute top-2/1 -translate-y-1/2 
                           w-16 h-16 rounded-xl bg-blue-100"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}

            {/* Icon */}
            <span
              className={`text-2xl mt-1 z-10 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {item.icon}
            </span>

            {/* Label */}
            <span
              className={`text-[11px] mt-1 z-10 transition-colors ${
                isActive ? "text-blue-600 font-medium" : "text-gray-500"
              }`}
            >
              {item.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
