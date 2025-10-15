import glove from "../glove_192.jpg";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({ isDashboard }) {
  const navigate = useNavigate();
  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 py-3 
                       bg-gradient-to-r from-white to-white-300 
                       shadow-lg backdrop-blur-md"
    >
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <img
          src={glove}
          alt="Logo"
          className="w-10 h-10 rounded-full border-2 border-white/50 shadow-md"
        />
        <h1 className="text-blue-900 text-xl sm:text-md font-bold tracking-wide drop-shadow-md">
          Glove Manufacturing
        </h1>
      </div>

      {/* Right: Status + Settings + User */}
      <div className="flex items-center gap-5">
        {/* Network Status */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-inner"></span>
          <span className="text-sm text-red-700 font-semibold">Offline</span>
        </div>

        {/* Settings Icon */}
        <Settings
          className="w-6 h-6 text-blue-900 hover:text-blue-700 transition-colors duration-300 cursor-pointer hover:scale-110"
          onClick={() => navigate("/settings")}
        />

        {/* Optional: User Info */}
        {isDashboard && (
          <div
            className="hidden sm:flex items-center gap-2 bg-blue-500 hover:bg-blue-400 
                          text-white text-sm font-medium px-4 py-2 rounded-xl shadow-md 
                          transition transform hover:-translate-y-0.5 hover:scale-105"
          >
            <img
              src={glove}
              alt="User"
              className="w-8 h-8 rounded-full border-2 border-white/50"
            />
            <span>Test User</span>
          </div>
        )}
      </div>
    </header>
  );
}
