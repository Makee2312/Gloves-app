import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLocation } from "react-router-dom";
export default function BatchProgress() {
  const location = useLocation();
  const { batchData } = location.state || {};
  const [batch, setBatch] = useState({
    id: 10001,
    status: "Completed",
    date: "Aug 29th, 2025",
    desc: "Dispatched successfully",
    processes: {
      latex: {
        mixingDuration: "30 min",
        temp: "100 °C",
        viscosity: "10001",
        stability: "10001",
        ph: "10001",
      },
      dipping: {
        waterTemp: "100 °C",
        chlorine: "45ml",
        ph: "56",
        solutionTemp: "10001",
        immersionSpeed: "10001",
        dwellingTime: "10001",
      },
      postDipping: {
        leachingTemp: "100 °C",
        flowRate: "45ms",
        duration: "23 min",
        dryTemp: "34 °C",
        humidity: "48",
        curingTime: "45 min",
      },
      finishing: {
        rollerSpeed: "100 °C",
        pressure: "45ms",
        polymerCoating: "34",
        humidity: "48",
        chlorineConc: "34",
        exposureTime: "1 hr",
      },
    },
  });
  console.log(batchData);
  return (
    <div className="p-4 space-y-4">
      <div
        className={`${
          batch.status == "Completed"
            ? "bg-green-200"
            : batch.status == "Failed"
            ? "bg-red-200"
            : batch.status == "In progress"
            ? "bg-blue-100"
            : "bg-gray-100"
        } rounded-lg p-4`}
      >
        <p className="text-sm">Batch id:</p>
        <h2 className="text-2xl font-bold">{batchData.gloveBatchId}</h2>
        <p className="text-xs mt-1">{batchData.status}</p>
        <div className="flex justify-between mt-2 text-sm">
          <span>{batchData.createdDate}</span>
          <span>{batchData.description}</span>
        </div>
      </div>

      <p className="font-semibold text-gray-700">Progress list</p>

      <SectionCard
        title="Latex compound preparation"
        color="bg-gray-700 text-white"
        data={batch.processes.latex}
      />

      <SectionCard
        title="Dipping Process"
        color="bg-sky-400 text-white"
        data={batch.processes.dipping}
      />

      <SectionCard
        title="Post Dipping Process"
        color="bg-fuchsia-400 text-white"
        data={batch.processes.postDipping}
      />

      <SectionCard
        title="Finishing process"
        color="bg-lime-400 text-white"
        data={batch.processes.finishing}
      />
    </div>
  );
}

function SectionCard({ title, color, data }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${color} rounded-xl shadow-md overflow-hidden cursor-pointer`}
    >
      <div
        className="flex justify-between items-center px-4 py-3"
        onClick={() => setOpen(!open)}
      >
        <h3 className="font-semibold">{title}</h3>
        {open ? <ChevronUp /> : <ChevronDown />}
      </div>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(data).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between bg-white/10 rounded-md px-2 py-1"
              >
                <span className="capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
