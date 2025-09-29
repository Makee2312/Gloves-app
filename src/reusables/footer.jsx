import {
  GrDashboard,
  GrMonitor,
  GrSettingsOption,
  GrTest,
} from "react-icons/gr";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <div className="sticky bottom-0 z-50 bg-gradient-to-r from-blue-600 to-cyan-600 h-14 flex justify-around items-center text-white">
      <button
        className="flex flex-col items-center text-xs"
        onClick={() => navigate("/")}
      >
        <GrDashboard />
        Dashboard
      </button>

      <button
        className="flex flex-col items-center text-xs"
        onClick={() => navigate("/progress")}
      >
        <GrMonitor />
        Monitor
      </button>

      <button
        className="flex flex-col items-center text-xs"
        onClick={() => navigate("/qc")}
      >
        <GrTest />
        QC
      </button>

      <button
        className="flex flex-col items-center text-xs"
        onClick={() => navigate("/settings")}
      >
        <GrSettingsOption />
        Settings
      </button>
    </div>
  );
}
