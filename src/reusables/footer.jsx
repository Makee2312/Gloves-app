import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GrDashboard, GrMonitor, GrTest } from "react-icons/gr";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useSettings } from "../hooks/useSettings";

const navItems = [
  { id: 0, name: "Dashboard", icon: <GrDashboard />, route: "/" },
  { id: 1, name: "Monitor", icon: <GrMonitor />, route: "/progress" },
  { id: 2, name: "QC", icon: <GrTest />, route: "/qc" },
];

export default function Footer() {
  const batchList = useSelector((state) => state.batchList);
  const [settings, saveSettings] = useSettings(batchList);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Reset footer visibility after 3s
  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 3000);
  };

  // Sync active tab with current location
  useEffect(() => {
    const current = navItems.findIndex(
      (item) => item.route === location.pathname
    );
    setActive(current !== -1 ? current : 0);

    const handleUserAction = () => {
      setVisible(true);
      resetTimeout();
    };

    window.addEventListener("scroll", handleUserAction);
    window.addEventListener("touchstart", handleUserAction);
    window.addEventListener("mousemove", handleUserAction);
    window.addEventListener("mousedown", handleUserAction);

    resetTimeout();

    return () => {
      window.removeEventListener("scroll", handleUserAction);
      window.removeEventListener("touchstart", handleUserAction);
      window.removeEventListener("mousemove", handleUserAction);
      window.removeEventListener("mousedown", handleUserAction);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [location.pathname]);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: visible ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-4 left-0 right-0 z-50 
                 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.1)] mx-[15%] rounded-2xl
                 h-16 flex justify-around items-center"
    >
      {navItems.map((item) => {
        const isActive = active === item.id;

        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            animate={isActive ? { scale: 0.9 } : { scale: 1 }}
            onClick={() => {
              setActive(item.id);
              saveSettings(batchList);
              navigate(item.route);
            }}
            className="relative flex flex-col items-center justify-center w-16"
          >
            {/* 🔵 Animated highlight square */}
            {isActive && (
              <motion.div
                layoutId="activeHighlight"
                className="absolute inset-0 rounded-xl bg-blue-100"
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
    </motion.div>
  );
}
