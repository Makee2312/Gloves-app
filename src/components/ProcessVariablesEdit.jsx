import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Pencil, Save } from "lucide-react";
import { processVariables } from "../config/variables";
import { processValidations } from "../config/rules";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

export default function ProcessVariablesEdit() {
  const [openSection, setOpenSection] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [validations, setValidations] = useState(processValidations);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const toggleEdit = (section) => {
    setEditingSection(editingSection === section ? null : section);
  };

  const handleChange = (processName, key, field, value) => {
    setValidations((prev) => ({
      ...prev,
      [processName]: {
        ...prev[processName],
        [key]: {
          ...prev[processName]?.[key],
          [field]:
            field === "min" || field === "max"
              ? parseFloat(value) || ""
              : value,
        },
      },
    }));
  };

  const saveToFile = async (processName) => {
    try {
      const data = JSON.stringify(validations, null, 2);

      if (window.Capacitor?.isNativePlatform) {
        await Filesystem.writeFile({
          path: "validations.json",
          data,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });
        alert(`✅ ${processName} module saved to validations.json`);
      } else {
        const blob = new Blob([data], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "validations.json";
        link.click();
        alert(`✅ ${processName} module exported as validations.json`);
      }

      setEditingSection(null);
    } catch (err) {
      console.error("Error saving file:", err);
      alert("❌ Failed to save file");
    }
  };

  const getValidationDetails = (processName, key) =>
    validations[processName]?.[key] || null;

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
            <div className="flex justify-between items-center px-4 py-3">
              <button
                onClick={() => toggleSection(processName)}
                className="flex-1 text-left font-medium text-lg capitalize hover:text-blue-600 transition"
              >
                {processName.replace(/([A-Z])/g, " $1")}
              </button>
              <button
                onClick={() => toggleEdit(processName)}
                className="ml-4 text-gray-500 hover:text-blue-600"
              >
                {editingSection === processName ? (
                  <Save
                    className="w-5 h-5"
                    onClick={() => saveToFile(processName)}
                  />
                ) : (
                  <Pencil className="w-5 h-5" />
                )}
              </button>
              <button onClick={() => toggleSection(processName)}>
                {openSection === processName ? (
                  <ChevronUp className="w-5 h-5 ml-2" />
                ) : (
                  <ChevronDown className="w-5 h-5 ml-2" />
                )}
              </button>
            </div>

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
                      if (item.values) {
                        return (
                          <div
                            key={idx}
                            className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800"
                          >
                            <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
                              {item.type}
                            </h3>
                            {item.values.map((v, i) => {
                              const val = getValidationDetails(
                                processName,
                                v.key
                              );
                              return (
                                <EditableVariableRow
                                  key={i}
                                  processName={processName}
                                  variable={v}
                                  validation={val}
                                  editing={editingSection === processName}
                                  onChange={handleChange}
                                />
                              );
                            })}
                          </div>
                        );
                      } else {
                        const val = getValidationDetails(processName, item.key);
                        return (
                          <EditableVariableRow
                            key={idx}
                            processName={processName}
                            variable={item}
                            validation={val}
                            editing={editingSection === processName}
                            onChange={handleChange}
                          />
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

/** Row for each variable — editable or view-only */
function EditableVariableRow({
  processName,
  variable,
  validation,
  editing,
  onChange,
}) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 hover:shadow-md bg-gray-50 dark:bg-gray-800 transition">
      <p className="font-medium text-gray-800 dark:text-gray-100">
        {variable.name}
      </p>

      {validation && (
        <div className="text-sm text-gray-600 dark:text-gray-400 my-2 space-y-1">
          {editing ? (
            <>
              {"min" in validation && (
                <div>
                  Min:{" "}
                  <input
                    type="number"
                    value={validation.min}
                    onChange={(e) =>
                      onChange(processName, variable.key, "min", e.target.value)
                    }
                    className="border rounded px-1 py-0.5 text-xs w-20 ml-1"
                  />
                </div>
              )}
              {"max" in validation && (
                <div>
                  Max:{" "}
                  <input
                    type="number"
                    value={validation.max}
                    onChange={(e) =>
                      onChange(processName, variable.key, "max", e.target.value)
                    }
                    className="border rounded px-1 py-0.5 text-xs w-20 ml-1"
                  />
                </div>
              )}
              {"allowed" in validation && (
                <div>
                  Allowed:{" "}
                  <input
                    type="text"
                    value={validation.allowed.join(", ")}
                    onChange={(e) =>
                      onChange(
                        processName,
                        variable.key,
                        "allowed",
                        e.target.value.split(",").map((v) => v.trim())
                      )
                    }
                    className="border rounded px-1 py-0.5 text-xs w-32 ml-1"
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {"min" in validation && "max" in validation && (
                <p>
                  Range:{" "}
                  <span className="font-semibold">
                    {validation.min} – {validation.max}
                  </span>
                </p>
              )}
              {"allowed" in validation && (
                <p>Allowed: {validation.allowed.join(", ")}</p>
              )}
              {"required" in validation && <p>Required</p>}
              {"maxLength" in validation && (
                <p>Max Length: {validation.maxLength}</p>
              )}
            </>
          )}
        </div>
      )}
      <p className="text-xs text-gray-500">Metric: {variable.metric}</p>
    </div>
  );
}
