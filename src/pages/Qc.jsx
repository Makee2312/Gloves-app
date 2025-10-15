import { getVariableNameByKey, processVariables } from "../config/variables";
import { processValidations } from "../config/rules";
import CustomDropdown from "../reusables/CustomDropdown";
import { useEffect, useState } from "react";
import { updateQCBatch } from "../store/batchListSlice";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import BatchSearchBox from "../reusables/BatchSearchBox";
import { useRef } from "react";

export default function Qc() {
  const location = useLocation();
  const { activeBatchId } = location.state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const qcVariables = processVariables.testingAndPackaging;
  const qcRules = processValidations.testingAndPackaging;
  const batchesList = useSelector((state) => state.batchList.batchLs);

  const [activeBatch, setActiveBatch] = useState(activeBatchId);
  const [modalErrors, setModalErrors] = useState([]);
  const [modalSuccess, setModalSuccess] = useState("");
  const [form, setForm] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const stepRefs = useRef([]);

  // initialize qc result data
  const [qcResultData, setQcResultData] = useState(
    qcVariables.map((qc) => ({
      type: qc.type,
      results:
        qc.type === "Visual inspection" ? { visualInspectionMethod: "" } : null,
    }))
  );

  useEffect(() => {
    if (activeBatch && batchesList) {
      const existingData = batchesList
        .find((batch) => batch.gloveBatchId === activeBatch)
        ?.steps.find((step) => step.processType === "qc");

      const qcData =
        !existingData?.data ||
        (typeof existingData.data === "object" &&
          Object.keys(existingData.data).length === 0)
          ? qcVariables.map((qc) => ({
              type: qc.type,
              results: null,
            }))
          : existingData.data;

      setQcResultData(qcData);
      const nextIndex = qcData.findIndex(
        (r) => !r.results || Object.keys(r.results).length === 0
      );
      setActiveStep(nextIndex === -1 ? 0 : nextIndex);
    }
  }, [activeBatch]);

  // 🧠 Step validation logic
  function validateStep() {
    const errors = [];
    const step = qcVariables[activeStep];
    if (!step) return errors;

    for (const v of step.values) {
      const raw = form[v.key];
      const isMissing =
        raw === undefined || raw === null || String(raw).trim() === "";
      if (isMissing) {
        errors.push({ message: `${v.name} is required.` });
        continue;
      }
      if (qcRules[v.key]) {
        const { min, max } = qcRules[v.key];
        const num = Number(raw);
        if (
          min !== undefined &&
          max !== undefined &&
          (Number.isNaN(num) || num < min || num > max)
        ) {
          errors.push({
            message: `${v.name} must be between ${min} and ${max} ${
              v.metric || ""
            }.`,
          });
        }
      }
    }
    return errors;
  }

  // 🧩 Form submission handler
  function handleSubmit(e) {
    e.preventDefault();
    const errors = validateStep();
    if (errors.length > 0) {
      setModalErrors(errors);
      setShowModal(true);
      return;
    }

    setQcResultData((prevSteps) => {
      const updatedSteps = [...prevSteps];
      updatedSteps[activeStep] = { ...updatedSteps[activeStep], results: form };

      dispatch(
        updateQCBatch({
          batchId: activeBatch,
          qcResultData: updatedSteps,
          photo: null,
          saved: activeStep === updatedSteps.length - 1,
        })
      );

      const nextIndex = updatedSteps.findIndex(
        (r) => !r.results || Object.keys(r.results).length === 0
      );
      if (nextIndex !== -1 && nextIndex <= updatedSteps.length - 1) {
        setActiveStep(nextIndex);
        stepRefs.current[nextIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        setModalErrors([]);
        setModalSuccess("🎉 Batch completed successfully!");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate("/");
        }, 1500);
      }

      setForm({});
      return updatedSteps;
    });
  }

  function handleEdit(index) {
    setActiveStep(index);
    const results = qcResultData[index]?.results || {};
    setForm(results);
    stepRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  function closeModal() {
    setShowModal(false);
  }

  // 🧭 Breadcrumb stepper
  const BreadcrumbStepper = () => (
    <div className="flex items-center justify-center overflow-x-auto mb-2 py-2 scrollbar-hide">
      {qcVariables.map((step, index) => {
        const isActive = activeStep === index;
        const isDone =
          qcResultData[index]?.results &&
          Object.keys(qcResultData[index].results).length > 0;
        const isDisabled = index > 0 && !qcResultData[index - 1]?.results;

        return (
          <div key={index} className="flex items-center">
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-full font-semibold text-xs transition-all cursor-pointer ${
                isDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isActive
                  ? "bg-blue-600 text-white scale-110"
                  : isDone
                  ? "bg-green-600 text-white"
                  : "bg-gray-400 text-white"
              }`}
              onClick={() => {
                if (!isDisabled) {
                  handleEdit(index);
                }
              }}
              title={step.type}
            >
              {index + 1}
            </div>
            <span
              className={`ml-2 text-xs sm:text-2xs hidden sm:inline font-medium ${
                isActive
                  ? "text-blue-700"
                  : isDone
                  ? "text-green-700"
                  : "text-gray-500"
              }`}
            >
              {step.type}
            </span>
            {index < qcVariables.length - 1 && (
              <div className="w-6 h-[2px] bg-gray-300"></div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="px-3 sm:px-6 py-3">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 border border-blue-100">
            {modalErrors.length > 0 ? (
              <>
                <h3 className="text-lg font-semibold text-red-700 mb-3">
                  Validation Errors
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {modalErrors.map((e, i) => (
                    <div
                      key={i}
                      className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800"
                    >
                      {e.message}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-2 text-green-600">🎉</div>
                <div className="text-lg font-semibold text-green-700">
                  {modalSuccess}
                </div>
              </div>
            )}
            <div className="mt-5 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Search */}
      {batchesList && (
        <BatchSearchBox
          batchesList={batchesList.filter((batch) => batch.status === "In QC")}
          activeBatch={activeBatch}
          setActiveBatch={setActiveBatch}
        />
      )}

      {activeBatch && (
        <div className="text-md text-center px-4 py-2 mb-3 font-semibold rounded-md bg-blue-700 text-white">
          Batch in QC: {activeBatch}
        </div>
      )}

      {/* Breadcrumb Header */}
      {activeBatch && <BreadcrumbStepper />}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeBatch ? (
          qcVariables.map((variable, index) => {
            const isActive = activeStep === index;
            const results = qcResultData[index]?.results;
            const isDone = results && Object.keys(results).length > 0;
            console.log(results);
            return (
              <div
                key={index}
                ref={(el) => (stepRefs.current[index] = el)}
                className={`rounded-lg p-4 shadow-md border mb-3 transition-all ${
                  isActive
                    ? "border-blue-300 bg-blue-50"
                    : isDone
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div
                      className="flex items-center justify-center h-4 w-4 mr-2 
               bg-gray-600 text-white rounded-full text-[10px] font-medium flex-shrink-0"
                    >
                      {index + 1}
                    </div>

                    <h3 className="font-semibold text-base sm:text-lg text-gray-800 leading-none">
                      {variable.type}
                    </h3>
                  </div>

                  {isDone && !isActive && (
                    <BiEdit
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 text-2xl cursor-pointer hover:scale-110 transition-transform"
                    />
                  )}
                </div>

                {isActive ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {variable.values.map((value) => (
                      <div key={value.key} className="block my-1">
                        <label className="text-sm block mb-1 font-medium text-gray-700">
                          {value.name}
                          <span className="text-xs text-gray-400 ml-1">
                            {(() => {
                              const rule = qcRules?.[value.key];
                              if (!rule || (!rule.min && !rule.max)) return "";
                              return `(${rule.min ?? ""} - ${rule.max ?? ""} ${
                                value.metric || ""
                              })`;
                            })()}
                          </span>
                        </label>

                        {value.type === "bool" ? (
                          <CustomDropdown
                            items={
                              qcRules?.[value.key]?.allowed ?? ["Yes", "No"]
                            }
                            onSelect={(selected) =>
                              setForm((prev) => ({
                                ...prev,
                                [value.key]: selected,
                              }))
                            }
                            placeHolder={form[value.key] ?? "Select"}
                          />
                        ) : (
                          <input
                            inputMode={
                              value.type === "number" ? "decimal" : "text"
                            }
                            type={value.type}
                            value={form[value.key] || ""}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                [value.key]: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            placeholder={`Enter ${value.name}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : results ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white rounded-md border border-gray-200 p-3">
                    {Object.entries(results).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex justify-between text-sm text-gray-700"
                      >
                        <span className="font-medium">
                          {getVariableNameByKey(key)}:
                        </span>
                        <span>{val ?? "-"}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  " Yet to test "
                )}

                {isActive && (
                  <button
                    type="submit"
                    className="mt-4 w-full py-2 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    {variable.type === "Packaging data"
                      ? "Save & Complete"
                      : "Save & Next"}
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center w-full h-max text-gray-500 text-center">
            No batches selected for QC
          </div>
        )}
      </form>
    </div>
  );
}
