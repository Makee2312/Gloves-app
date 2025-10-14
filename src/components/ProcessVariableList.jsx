import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { processVariables } from "../config/variables";
import { processValidations } from "../config/rules";

export default function ProcessVariableList() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const getValidationDetails = (processName, key) => {
    const processValidation = processValidations[processName];
    if (!processValidation) return null;
    return processValidation[key] || null;
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
        Process Variable Settings
      </h1>

      <div className="space-y-4">
        {Object.entries(processVariables).map(([processName, variables]) => (
          <div
            key={processName}
            className="border border-gray-300 dark:border-gray-700 rounded-2xl shadow-sm bg-white dark:bg-gray-900"
          >
            {/* Accordion header */}
            <button
              onClick={() => toggleSection(processName)}
              className="w-full flex justify-between items-center px-4 py-3 font-medium text-left text-lg capitalize hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <span>{processName.replace(/([A-Z])/g, " $1")}</span>
              {openSection === processName ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {/* Accordion content */}
            <AnimatePresence>
              {openSection === processName && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                    {variables.map((item, idx) => {
                      // Nested structure (e.g., testingAndPackaging)
                      if (item.values) {
                        return (
                          <div
                            key={idx}
                            className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800"
                          >
                            <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
                              {item.type}
                            </h3>
                            <ul className="space-y-1 text-sm">
                              {item.values.map((v, i) => {
                                const validation = getValidationDetails(
                                  processName,
                                  v.key
                                );
                                return (
                                  <li
                                    key={i}
                                    className="flex flex-col border-b border-gray-100 dark:border-gray-700 pb-1"
                                  >
                                    <div className="flex justify-between">
                                      <span cl assName="font-medium">
                                        {v.name}
                                      </span>
                                      <span className="text-gray-500">
                                        {v.metric}
                                      </span>
                                    </div>
                                    {validation && (
                                      <ValidationText validation={validation} />
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      } else {
                        // Simple variable
                        const validation = getValidationDetails(
                          processName,
                          item.key
                        );
                        return (
                          <div
                            key={idx}
                            className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 hover:shadow-md bg-gray-50 dark:bg-gray-800 transition"
                          >
                            <p className="font-medium text-gray-800 dark:text-gray-100">
                              {item.name}
                            </p>
                            {validation && (
                              <ValidationText validation={validation} />
                            )}{" "}
                            <p className="text-xs text-gray-500">
                              Metric: {item.metric}
                            </p>
                          </div>
                        );
                      }
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Helper component to render validation info */
function ValidationText({ validation }) {
  return (
    <div className="text-sm text-gray-600 dark:text-gray-400 my-2">
      {validation.min !== undefined && validation.max !== undefined && (
        <p>
          Range:{" "}
          <span className="font-semibold">
            {validation.min} – {validation.max}
          </span>
        </p>
      )}
      {validation.allowed && (
        <p>
          Allowed:{" "}
          <span className="font-semibold">{validation.allowed.join(", ")}</span>
        </p>
      )}
      {validation.required && (
        <p className="font-semibold text-red-500">Required</p>
      )}
      {validation.maxLength && (
        <p>
          Max Length:{" "}
          <span className="font-semibold">{validation.maxLength}</span>
        </p>
      )}
    </div>
  );
}
