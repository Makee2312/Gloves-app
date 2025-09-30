import { useState } from "react";

const batches = [
  {
    gloveBatchId: "GB823-20250924-Surgical",
    batchLabel: "GB823",
    status: ["Completed", "In Progress", "Pending", "Pending"],
    currentStep: 2,
    productType: "Surgical Glove",
    latexBatchId: "B789-20250924",
    manufacturingDate: "2025-09-24T10:30:00Z",
    dippingProcess: {
      compoundPrep: {
        compoundRecipeId: "SURG-20250924-A",
        monitoredData: [
          { parameterName: "Latex Input Volume", value: 5000, metric: "L" },
          { parameterName: "Sulfur Dosage", value: 50, metric: "kg" },

          { parameterName: "Zinc Oxide Dosage", value: 25, metric: "kg" },

          { parameterName: "Accelerator Dosage", value: 5, metric: "kg" },

          { parameterName: "Stabilizer Dosage", value: 2.5, metric: "kg" },

          {
            parameterName: "Compounding Duration",
            value: 60,
            metric: "minutes",
          },
        ],
        calculatedParameters: [
          {
            parameterName: "Final Compound pH",
            value: 10.8,
            metric: "pH",
            status: "Pass",
          },
        ],
      },
      formerPrep: {
        monitoredData: [
          {
            parameterName: "Former Cleaning Log",
            value: "Confirmed wash cycle",
            metric: "text",
          },

          {
            parameterName: "Coagulant Concentration",
            value: 20,
            metric: "%wt",
          },

          { parameterName: "Coagulant Temperature", value: 60, metric: "°C" },
        ],
      },

      latexDipping: {
        monitoredData: [
          { parameterName: "Dipping Speed", value: 12, metric: "m/min" },

          { parameterName: "Dwell Time", value: 15, metric: "seconds" },

          {
            parameterName: "Viscosity Sensor Reading",
            value: 1200,
            metric: "cP",
          },
        ],
      },
    },
    postDipping: {
      leaching: {
        monitoredData: [
          {
            parameterName: "Leach Bath 1 Temperature",
            value: 70,
            metric: "°C",
          },

          {
            parameterName: "Leach Bath 1 Duration",
            value: 3,
            metric: "minutes",
          },

          {
            parameterName: "Leach Bath 2 Temperature",
            value: 80,
            metric: "°C",
          },

          {
            parameterName: "Leach Bath 2 Duration",
            value: 5,
            metric: "minutes",
          },
        ],
      },

      curing: {
        monitoredData: [
          { parameterName: "Oven Temperature", value: "120°C", metric: "text" },

          { parameterName: "Curing Time", value: 25, metric: "minutes" },
        ],
      },

      finishing: {
        monitoredData: [
          { parameterName: "Coating Concentration", value: 2.5, metric: "%wt" },

          { parameterName: "Chlorination Time", value: 5, metric: "minutes" },
        ],
      },
    },
    qualityControlResults: {
      labTestData: [],
      calculatedParameters: [],
    },
    progress: [
      { step: 1, name: "Compound Preparation", status: "Completed" },
      { step: 2, name: "Dipping Process", status: "In Progress" },
      { step: 3, name: "Post-Dipping", status: "Pending" },
      { step: 4, name: "Quality Control", status: "Pending" },
    ],
  },
  {
    gloveBatchId: "GB823-20250924-Surgical",
    batchLabel: "GB823",
    status: ["Completed", "In Progress", "Pending", "Pending"],
    currentStep: 2,
    productType: "Surgical Glove",
    latexBatchId: "B789-20250924",
    manufacturingDate: "2025-09-24T10:30:00Z",
    dippingProcess: {
      compoundPrep: {
        compoundRecipeId: "SURG-20250924-A",
        monitoredData: [
          { parameterName: "Latex Input Volume", value: 5000, metric: "L" },
          { parameterName: "Sulfur Dosage", value: 50, metric: "kg" },
          { parameterName: "Zinc Oxide Dosage", value: 25, metric: "kg" },
          { parameterName: "Accelerator Dosage", value: 5, metric: "kg" },
          { parameterName: "Stabilizer Dosage", value: 2.5, metric: "kg" },
          {
            parameterName: "Compounding Duration",
            value: 60,
            metric: "minutes",
          },
        ],
        calculatedParameters: [
          {
            parameterName: "Final Compound pH",
            value: 10.8,
            metric: "pH",
            status: "Pass",
          },
        ],
      },
      formerPrep: {
        monitoredData: [
          {
            parameterName: "Former Cleaning Log",
            value: "Confirmed wash cycle",
            metric: "text",
          },
          {
            parameterName: "Coagulant Concentration",
            value: 20,
            metric: "%wt",
          },
          { parameterName: "Coagulant Temperature", value: 60, metric: "°C" },
        ],
      },
      latexDipping: {
        monitoredData: [
          { parameterName: "Dipping Speed", value: 12, metric: "m/min" },
          { parameterName: "Dwell Time", value: 15, metric: "seconds" },
          {
            parameterName: "Viscosity Sensor Reading",
            value: 1200,
            metric: "cP",
          },
        ],
      },
    },
    postDipping: {
      leaching: {
        monitoredData: [
          {
            parameterName: "Leach Bath 1 Temperature",
            value: 70,
            metric: "°C",
          },
          {
            parameterName: "Leach Bath 1 Duration",
            value: 3,
            metric: "minutes",
          },
          {
            parameterName: "Leach Bath 2 Temperature",
            value: 80,
            metric: "°C",
          },
          {
            parameterName: "Leach Bath 2 Duration",
            value: 5,
            metric: "minutes",
          },
        ],
      },
      curing: {
        monitoredData: [
          { parameterName: "Oven Temperature", value: "120°C", metric: "text" },
          { parameterName: "Curing Time", value: 25, metric: "minutes" },
        ],
      },
      finishing: {
        monitoredData: [
          { parameterName: "Coating Concentration", value: 2.5, metric: "%wt" },
          { parameterName: "Chlorination Time", value: 5, metric: "minutes" },
        ],
      },
    },
    qualityControlResults: {
      labTestData: [],
      calculatedParameters: [],
    },
    progress: [
      { step: 1, name: "Compound Preparation", status: "Completed" },
      { step: 2, name: "Dipping Process", status: "In Progress" },
      { step: 3, name: "Post-Dipping", status: "Pending" },
      { step: 4, name: "Quality Control", status: "Pending" },
    ],
  },
  // Fully completed & passed
  {
    gloveBatchId: "GB900-20251001-Surgical",
    batchLabel: "GB900",
    status: ["Completed", "Completed", "Completed", "Completed"],
    currentStep: 4,
    productType: "Surgical Glove",
    latexBatchId: "B900-20251001",
    manufacturingDate: "2025-10-01T09:00:00Z",
    dippingProcess: {
      compoundPrep: {
        compoundRecipeId: "SURG-20251001-A",
        monitoredData: [
          { parameterName: "Latex Input Volume", value: 5200, metric: "L" },
          { parameterName: "Sulfur Dosage", value: 52, metric: "kg" },
          { parameterName: "Zinc Oxide Dosage", value: 26, metric: "kg" },
          { parameterName: "Accelerator Dosage", value: 5.2, metric: "kg" },
          { parameterName: "Stabilizer Dosage", value: 2.6, metric: "kg" },
          {
            parameterName: "Compounding Duration",
            value: 62,
            metric: "minutes",
          },
        ],
        calculatedParameters: [
          {
            parameterName: "Final Compound pH",
            value: 10.7,
            metric: "pH",
            status: "Pass",
          },
        ],
      },
      formerPrep: {
        monitoredData: [
          {
            parameterName: "Former Cleaning Log",
            value: "Confirmed wash cycle",
            metric: "text",
          },
          {
            parameterName: "Coagulant Concentration",
            value: 21,
            metric: "%wt",
          },
          { parameterName: "Coagulant Temperature", value: 61, metric: "°C" },
        ],
      },
      latexDipping: {
        monitoredData: [
          { parameterName: "Dipping Speed", value: 13, metric: "m/min" },
          { parameterName: "Dwell Time", value: 16, metric: "seconds" },
          {
            parameterName: "Viscosity Sensor Reading",
            value: 1190,
            metric: "cP",
          },
        ],
      },
    },
    postDipping: {
      leaching: {
        monitoredData: [
          {
            parameterName: "Leach Bath 1 Temperature",
            value: 72,
            metric: "°C",
          },
          {
            parameterName: "Leach Bath 1 Duration",
            value: 4,
            metric: "minutes",
          },
          {
            parameterName: "Leach Bath 2 Temperature",
            value: 82,
            metric: "°C",
          },
          {
            parameterName: "Leach Bath 2 Duration",
            value: 6,
            metric: "minutes",
          },
        ],
      },
      curing: {
        monitoredData: [
          { parameterName: "Oven Temperature", value: "122°C", metric: "text" },
          { parameterName: "Curing Time", value: 27, metric: "minutes" },
        ],
      },
      finishing: {
        monitoredData: [
          { parameterName: "Coating Concentration", value: 2.6, metric: "%wt" },
          { parameterName: "Chlorination Time", value: 6, metric: "minutes" },
        ],
      },
    },
    qualityControlResults: {
      labTestData: [
        { testName: "Dimensional Test", value: "Pass", metric: "" },
        { testName: "Tensile Strength", value: "Pass", metric: "" },
      ],
      calculatedParameters: [
        {
          parameterName: "AQL Watertight Result",
          value: "Accepted",
          metric: "",
          status: "Pass",
        },
        {
          parameterName: "Extractable Protein Level",
          value: 45,
          metric: "μg/g",
          status: "Pass",
        },
      ],
    },
    progress: [
      { step: 1, name: "Compound Preparation", status: "Completed" },
      { step: 2, name: "Dipping Process", status: "Completed" },
      { step: 3, name: "Post-Dipping", status: "Completed" },
      { step: 4, name: "Quality Control", status: "Completed" },
    ],
  },
  // Partially completed at stage 3, pass
  {
    gloveBatchId: "GB901-20251002-Surgical",
    batchLabel: "GB901",
    status: ["Completed", "Completed", "In Progress", "Pending"],
    currentStep: 3,
    productType: "Surgical Glove",
    latexBatchId: "B901-20251002",
    manufacturingDate: "2025-10-02T10:15:00Z",
    dippingProcess: {
      compoundPrep: {
        compoundRecipeId: "SURG-20251002-A",
        monitoredData: [
          { parameterName: "Latex Input Volume", value: 5100, metric: "L" },
          { parameterName: "Sulfur Dosage", value: 51, metric: "kg" },
        ],
        calculatedParameters: [
          {
            parameterName: "Final Compound pH",
            value: 10.9,
            metric: "pH",
            status: "Pass",
          },
        ],
      },
      formerPrep: {
        monitoredData: [
          {
            parameterName: "Former Cleaning Log",
            value: "Confirmed wash cycle",
            metric: "text",
          },
        ],
      },
      latexDipping: {
        monitoredData: [
          { parameterName: "Dipping Speed", value: 13, metric: "m/min" },
        ],
      },
    },
    postDipping: {
      leaching: {
        monitoredData: [
          {
            parameterName: "Leach Bath 1 Temperature",
            value: 75,
            metric: "°C",
          },
        ],
      },
      curing: { monitoredData: [] },
      finishing: { monitoredData: [] },
    },
    qualityControlResults: {
      labTestData: [
        { testName: "Dimensional Test", value: "Pending", metric: "" },
      ],
      calculatedParameters: [
        {
          parameterName: "Extractable Protein Level",
          value: 48,
          metric: "μg/g",
          status: "Pass",
        },
      ],
    },
    progress: [
      { step: 1, name: "Compound Preparation", status: "Completed" },
      { step: 2, name: "Dipping Process", status: "Completed" },
      { step: 3, name: "Post-Dipping", status: "In Progress" },
      { step: 4, name: "Quality Control", status: "Pending" },
    ],
  },
  // Partially completed at stage 3, pass
  {
    gloveBatchId: "GB902-20251003-Surgical",
    batchLabel: "GB902",
    status: ["Completed", "Completed", "In Progress", "Pending"],
    currentStep: 3,
    productType: "Surgical Glove",
    latexBatchId: "B902-20251003",
    manufacturingDate: "2025-10-03T11:45:00Z",
    dippingProcess: {
      compoundPrep: {
        compoundRecipeId: "SURG-20251003-A",
        monitoredData: [
          { parameterName: "Latex Input Volume", value: 5050, metric: "L" },
          { parameterName: "Sulfur Dosage", value: 49, metric: "kg" },
        ],
        calculatedParameters: [
          {
            parameterName: "Final Compound pH",
            value: 10.6,
            metric: "pH",
            status: "Pass",
          },
        ],
      },
      formerPrep: {
        monitoredData: [
          {
            parameterName: "Former Cleaning Log",
            value: "Confirmed wash cycle",
            metric: "text",
          },
        ],
      },
      latexDipping: {
        monitoredData: [
          { parameterName: "Dipping Speed", value: 12.5, metric: "m/min" },
        ],
      },
    },
    postDipping: {
      leaching: {
        monitoredData: [
          {
            parameterName: "Leach Bath 1 Temperature",
            value: 73,
            metric: "°C",
          },
        ],
      },
      curing: { monitoredData: [] },
      finishing: { monitoredData: [] },
    },
    qualityControlResults: {
      labTestData: [],
      calculatedParameters: [],
    },
    progress: [
      { step: 1, name: "Compound Preparation", status: "Completed" },
      { step: 2, name: "Dipping Process", status: "Completed" },
      { step: 3, name: "Post-Dipping", status: "In Progress" },
      { step: 4, name: "Quality Control", status: "Pending" },
    ],
  },
  // Fully completed but fail in some QC
  {
    gloveBatchId: "GB903-20251004-Surgical",
    batchLabel: "GB903",
    status: ["Completed", "Completed", "Completed", "Completed"],
    currentStep: 4,
    productType: "Surgical Glove",
    latexBatchId: "B903-20251004",
    manufacturingDate: "2025-10-04T12:30:00Z",
    dippingProcess: {
      compoundPrep: {
        compoundRecipeId: "SURG-20251004-A",
        monitoredData: [
          { parameterName: "Latex Input Volume", value: 5300, metric: "L" },
          { parameterName: "Sulfur Dosage", value: 53, metric: "kg" },
        ],
        calculatedParameters: [
          {
            parameterName: "Final Compound pH",
            value: 10.5,
            metric: "pH",
            status: "Pass",
          },
        ],
      },
      formerPrep: {
        monitoredData: [
          {
            parameterName: "Former Cleaning Log",
            value: "Confirmed wash cycle",
            metric: "text",
          },
        ],
      },
      latexDipping: {
        monitoredData: [
          { parameterName: "Dipping Speed", value: 13.5, metric: "m/min" },
        ],
      },
    },
    postDipping: {
      leaching: {
        monitoredData: [
          {
            parameterName: "Leach Bath 1 Temperature",
            value: 76,
            metric: "°C",
          },
        ],
      },
      curing: { monitoredData: [] },
      finishing: { monitoredData: [] },
    },
    qualityControlResults: {
      labTestData: [
        { testName: "Dimensional Test", value: "Fail", metric: "" },
        { testName: "Tensile Strength", value: "Pass", metric: "" },
      ],
      calculatedParameters: [
        {
          parameterName: "AQL Watertight Result",
          value: "Rejected",
          metric: "",
          status: "Fail",
        },
        {
          parameterName: "Extractable Protein Level",
          value: 55,
          metric: "μg/g",
          status: "Fail",
        },
      ],
    },
    progress: [
      { step: 1, name: "Compound Preparation", status: "Completed" },
      { step: 2, name: "Dipping Process", status: "Completed" },
      { step: 3, name: "Post-Dipping", status: "Completed" },
      { step: 4, name: "Quality Control", status: "Completed" },
    ],
  },
];

export default function BatchProgress() {
  const [selectedBatchIdx, setSelectedBatchIdx] = useState(0);
  const batch = batches[selectedBatchIdx];
  const [drawerData, setDrawerData] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8 px-2 md:px-0">
      {/* Container */}
      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-4 space-y-6">
        {/* <div className="w-full max-w-full md:max-w-full bg-white rounded-xl shadow-lg p-4 space-y-6"> */}
        {/* Batch Selection */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-700">Process Flow</h1>
            <p className="text-xs text-gray-500">
              Glove Batch:{" "}
              <span className="font-semibold">{batch.batchLabel}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="batchSelect"
            >
              Batch:
            </label>
            <select
              id="batchSelect"
              className="rounded border px-2 py-1"
              value={selectedBatchIdx}
              onChange={(e) => setSelectedBatchIdx(Number(e.target.value))}
            >
              {batches.map((b, idx) => (
                <option key={b.gloveBatchId} value={idx}>
                  {b.batchLabel}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step Tracker */}
        <StepTracker progress={batch.progress} />

        {/* Cards: Show in grid for desktop, stacked for mobile */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
          <ProcessCard
            title="Compound Preparation"
            status={batch.progress[0].status}
            data={batch.dippingProcess.compoundPrep}
            onView={() =>
              setDrawerData({
                title: "Compound Preparation",
                data: batch.dippingProcess.compoundPrep,
              })
            }
            step={1}
          />
          <ProcessCard
            title="Dipping Process"
            status={batch.progress[1].status}
            data={batch.dippingProcess.latexDipping}
            onView={() =>
              setDrawerData({
                title: "Dipping Process",
                data: batch.dippingProcess.latexDipping,
              })
            }
            step={2}
          />
          <ProcessCard
            title="Post-Dipping"
            status={batch.progress[2].status}
            data={batch.postDipping.leaching}
            onView={() =>
              setDrawerData({
                title: "Post-Dipping",
                data: batch.postDipping.leaching,
              })
            }
            step={3}
          />
          <ProcessCard
            title="Quality Control"
            status={batch.progress[3].status}
            data={batch.qualityControlResults}
            onView={() =>
              setDrawerData({
                title: "Quality Control",
                data: batch.qualityControlResults,
              })
            }
            step={4}
          />
        </div>
      </div>

      {/* Drawer */}
      <Drawer
        open={!!drawerData}
        onClose={() => setDrawerData(null)}
        title={drawerData?.title}
        data={drawerData?.data}
      />
    </div>
  );
}

function StepTracker({ progress }) {
  return (
    <div className="flex justify-between items-center w-full gap-2 mb-4">
      {progress.map((step, idx) => (
        <div key={step.step} className="flex flex-col items-center flex-1">
          <div
            className={`rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-bold text-lg
              ${
                step.status === "Completed"
                  ? "bg-green-500 text-white"
                  : step.status === "In Progress"
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
          >
            {step.step}
          </div>
          <span
            className={`text-xs md:text-sm mt-2 text-center ${
              step.status === "Completed"
                ? "text-green-600"
                : step.status === "In Progress"
                ? "text-yellow-600"
                : "text-gray-500"
            }`}
          >
            {step.name}
          </span>
          {idx < progress.length - 1 && (
            <div className="hidden md:block w-12 h-1 bg-gray-300 mx-auto mt-1" />
          )}
        </div>
      ))}
    </div>
  );
}

function ProcessCard({ title, status, data, onView, step }) {
  const statusColor =
    status === "Completed"
      ? "bg-green-100 border-green-400"
      : status === "In Progress"
      ? "bg-yellow-100 border-yellow-400"
      : "bg-gray-100 border-gray-300";
  return (
    <div
      className={`rounded-lg border-2 ${statusColor} p-4 flex flex-col justify-between shadow-sm`}
    >
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-base md:text-lg">{title}</p>
        <span
          className={`px-2 py-1 rounded text-xs font-medium
          ${
            status === "Completed"
              ? "bg-green-200 text-green-700"
              : status === "In Progress"
              ? "bg-yellow-200 text-yellow-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {status}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-1 text-sm">
        {data?.monitoredData?.slice(0, 2).map((item, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-gray-600">{item.parameterName}</span>
            <span className="font-semibold">
              {item.value} {item.metric}
            </span>
          </div>
        ))}
        {data?.labTestData?.slice(0, 2).map((item, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-gray-600">{item.testName}</span>
            <span className="font-semibold">
              {item.value} {item.metric}
            </span>
          </div>
        ))}
      </div>
      <button
        className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition"
        onClick={onView}
      >
        Monitor Details
      </button>
    </div>
  );
}

function Drawer({ open, onClose, title, data }) {
  return (
    <div
      className={
        "fixed inset-0 z-50 flex justify-end transition-opacity duration-300 " +
        (open ? "opacity-100 visible" : "opacity-0 invisible")
      }
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={
          "relative bg-white w-full max-w-md md:w-96 h-full shadow-lg p-4 overflow-y-auto transform transition-transform duration-300 " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        {data && (
          <>
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-lg">{title}</h3>
              <button
                className="text-gray-500 hover:text-black"
                onClick={onClose}
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              {(data.monitoredData || data.labTestData || []).map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b py-1 text-gray-700"
                >
                  <span>{item.parameterName || item.testName}</span>
                  <span className="font-semibold">
                    {item.value ? `${item.value} ${item.metric || ""}` : ""}
                  </span>
                </div>
              ))}
              {data.calculatedParameters?.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b py-1 text-gray-700"
                >
                  <span>{item.parameterName}</span>
                  <span className="font-semibold">
                    {item.value} {item.metric}
                  </span>
                  <span
                    className={`ml-2 text-xs ${
                      item.status === "Pass" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
