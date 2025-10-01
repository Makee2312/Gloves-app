import { useState } from "react";

const steps = [
  "Raw Material Preparation",
  "Formers Cleaning & Heating",
  "Coagulant Dip",
  "Dipping into Compound (Latex/Nitrile/Vinyl)",
  "Leaching (Hot Water Wash)",
  "Curing / Vulcanization",
  "Beading (Cuff Formation)",
  "Surface Treatment (Chlorination / Polymer / Powdering)",
  "Stripping from Formers",
  "Quality Inspection & Leak Test",
  "Sterilization (if required)",
  "Packaging & Labeling",
  "End → Ready for Shipment",
];

export default function GloveProcessFlow() {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      {steps.map((step, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div
            onClick={() => setActiveStep(activeStep === idx ? null : idx)}
            className="cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-2xl shadow-md w-64 text-center hover:bg-blue-600 transition"
          >
            {step}
          </div>
          {activeStep === idx && (
            <p className="text-sm mt-2 text-gray-700">
              Details about <strong>{step}</strong> go here...
            </p>
          )}
          {idx < steps.length - 1 && (
            <div className="w-1 h-6 bg-gray-400"></div>
          )}
        </div>
      ))}
    </div>
  );
}
