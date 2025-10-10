import { processVariables } from "../config/variables";
import { processValidations } from "../config/rules";
import CustomDropdown from "../reusables/CustomDropdown";
import { useState } from "react";
import { updateQCBatch } from "../store/batchListSlice";
import { useDispatch, useSelector } from "react-redux";
import { all } from "axios";
import { BiEdit } from "react-icons/bi";

export default function Qc() {
  const dispatch = useDispatch();
  const qcVariables = processVariables.testingAndPackaging;
  const qcRules = processValidations.testingAndPackaging;

  const [modalErrors, setModalErrors] = useState([]);
  // ✅ Initialize steps properly
  const [qcResultData, setQcResultData] = useState(
    qcVariables.map((qc) => ({
      type: qc.type,
      results:
        qc.type === "Visual inspection" ? { visualInspectionMethod: "" } : null,
    }))
  );

  const [form, setForm] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fixed handleSubmit logic
  function handleSubmit(e) {
    e.preventDefault();
    const errors = validateStep();
    if (errors.length > 0) {
      setModalErrors(errors);
      setShowModal(true);
      return;
    } else {
      setModalErrors([]);
      setShowModal(false);
    }
    setQcResultData((prevSteps) => {
      const UpdatedSteps = [...prevSteps];
      UpdatedSteps[activeStep] = { ...UpdatedSteps[activeStep], results: form };
      return UpdatedSteps;
    });
    console.log(qcResultData);
    setForm({});

    dispatch(
      updateQCBatch({
        batchId: 10001,
        qcResultData: qcResultData,
        photo: null,
      })
    );
    setActiveStep(
      activeStep + 1 < qcResultData.length - 1
        ? activeStep + 1
        : qcResultData.length - 1
    );
    console.log("Updated Steps:", qcResultData);
  }

  function validateStep() {
    const errors = [];
    const step = qcResultData[activeStep];

    if (!step) return errors;
    const variables = qcVariables.find((qcVar) => qcVar.type == step.type);
    console.log(variables);
    for (const v of variables.values) {
      const raw = form[v.key];
      const isMissing =
        raw === undefined || raw === null || String(raw).trim() === "";
      if (isMissing) {
        errors.push({
          message: `${v.name} is required.`,
        });
        continue;
      }
      if (qcRules[v.key]) {
        const { min, max } = qcRules[v.key];
        const num = Number(raw);
        if (Number.isNaN(num) || num < min || num > max) {
          errors.push({
            message: `${v.name} must be between ${min} and ${max} ${v.metric}.`,
          });
        }
      }
    }
    console.log(qcResultData);
    return errors;
  }

  function closeModal() {
    setShowModal(false);
  }
  // function validateAllSteps(batchToCheck) {
  //   const errors = [];
  //   for (let i = 0; i < stepsConfig.length; i++) {
  //     const data = batchToCheck?.steps?.[i]?.data || {};
  //     const e = validateStep(i, data);
  //     if (e.length) errors.push(...e);
  //   }
  //   return errors;
  // }

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-lg font-bold mb-4">Quality control</div>
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 border border-blue-100">
            {modalErrors && modalErrors.length > 0 ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl text-red-600">⚠️</div>
                  <h3 className="text-lg font-semibold text-red-700">
                    {qcResultData[activeStep]?.type} - Validation
                  </h3>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-3">
                  {modalErrors.map((e, i) => (
                    <div
                      key={i}
                      className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800"
                    >
                      <div className="font-medium">{e.message}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-3 text-green-600">🎉</div>
                <div className="text-lg font-semibold text-green-700">
                  Saved successfully
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

      {qcVariables.map((variable, index) => (
        <div
          key={index}
          className="bg-gray-50 rounded-lg p-4 shadow-md border border-blue-100 mb-4"
        >
          <div className="text-lg text-left text-gray-700 mb-2">
            {index + variable.type}
          </div>
          <div
            className={
              activeStep > index ? "flex text-center justify-center " : ""
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeStep === index ? (
                variable.values.map((value) => (
                  <div key={value.key} className="block my-2">
                    <label className="text-sm block mb-1 font-medium text-gray-700">
                      {value.name}
                      <span className="text-xs text-gray-400 ml-1">
                        {(() => {
                          const rule = qcRules?.[value.key];
                          if (!rule || (rule.min == null && rule.max == null))
                            return "";
                          return `(${rule.min ?? ""} - ${rule.max ?? ""} ${
                            value.metric || ""
                          })`;
                        })()}
                      </span>
                    </label>

                    {value.type === "bool" ? (
                      <CustomDropdown
                        items={qcRules?.[value.key]?.allowed || ["Yes", "No"]}
                        onSelect={(selected) =>
                          setForm((prev) => ({
                            ...prev,
                            [value.key]: selected,
                          }))
                        }
                        placeHolder={form[value.key]}
                      />
                    ) : (
                      <input
                        inputMode="decimal"
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
                        disabled={false}
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm italic">
                  {activeStep > index ? (
                    <div>{JSON.stringify(qcResultData[index].results)}</div>
                  ) : (
                    "Yet to test"
                  )}
                </div>
              )}
            </div>
            {activeStep > index ? (
              <BiEdit
                className="text-center text-3xl"
                onClick={() => {
                  setActiveStep(index);
                  setForm({});
                  console.log(qcResultData);
                  Object.entries(qcResultData[index].results).map(
                    ([key, value]) => {
                      form[key] = value;
                    }
                  );
                  setForm(form);
                  console.log(form);
                  console.log(qcResultData);
                }}
              />
            ) : null}
          </div>
          {activeStep === index ? (
            <button
              type="submit"
              className={`mt-4 w-full py-2 rounded font-semibold ${"bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              {variable.type === "Packaging data"
                ? "Save & Complete"
                : "Save & Next"}
            </button>
          ) : null}
        </div>
      ))}
    </form>
  );
}
