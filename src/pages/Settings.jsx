import { useState } from "react";
import ProcessVariablesEdit from "../components/ProcessVariablesEdit";
import {
  FaUser,
  FaUsersCog,
  FaKey,
  FaClipboardCheck,
  FaFileExport,
  FaDatabase,
} from "react-icons/fa";

const settingsList = [
  {
    title: "User Management",
    description: "Add, edit, or remove users.",
    icon: <FaUsersCog size={24} />,
    component: () => <div>User Management UI goes here</div>,
  },
  {
    title: "User Profile Settings",
    description: "Manage your personal profile details.",
    icon: <FaUser size={24} />,
    component: () => <div>User Profile Settings UI goes here</div>,
  },
  {
    title: "Role Access Settings",
    description: "Control user roles and permissions.",
    icon: <FaKey size={24} />,
    component: () => <div>Role Access Settings UI goes here</div>,
  },
  {
    title: "Process Variables Validation",
    description: "Set validation rules for process variables.",
    icon: <FaClipboardCheck size={24} />,
    component: () => <ProcessVariablesEdit />,
  },
  {
    title: "Export Settings",
    description: "Export your configuration and reports.",
    icon: <FaFileExport size={24} />,
    component: () => <div>Export Settings UI goes here</div>,
  },
  {
    title: "Backup Settings",
    description: "Configure system backup options.",
    icon: <FaDatabase size={24} />,
    component: () => <div>Backup Settings UI goes here</div>,
  },
];

export default function Settings() {
  const [activeSetting, setActiveSetting] = useState(null);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsList.map((setting, index) => (
          <div
            key={index}
            className={`bg-white  shadow-md rounded-xl p-6 flex flex-col items-start gap-4 hover:shadow-lg transition-shadow cursor-pointer ${
              activeSetting === index ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() =>
              setActiveSetting((prev) => (prev === index ? null : index))
            }
          >
            <div className="text-blue-600 ">
              {setting.icon}
            </div>
            <h2 className="text-lg font-semibold">{setting.title}</h2>
            <p className="text-gray-600  text-sm">
              {setting.description}
            </p>
          </div>
        ))}
      </div>

      {/* Drawer/Panel */}
      {activeSetting !== null && (
        <div
          className="fixed top-0 right-0 w-full sm:w-1/2 lg:w-1/3 bg-white shadow-2xl p-6 overflow-y-auto z-50 transition-transform transform
               -mt-5 mb-5 h-[90vh]" // 🔹 added negative top margin, bottom margin, and custom height
        >
          <button
            className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => setActiveSetting(null)}
          >
            Close
          </button>
          <h2 className="text-xl font-bold mb-4">
            {settingsList[activeSetting].title}
          </h2>
          <div className="space-y-4">
            {settingsList[activeSetting].component()}
          </div>
        </div>
      )}

      {/* Overlay */}
      {activeSetting !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setActiveSetting(null)}
        />
      )}
    </div>
  );
}
