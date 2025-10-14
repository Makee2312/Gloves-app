import { getVariableNameByKey, processVariables } from "../config/variables";
import { processValidations } from "../config/rules";
import CustomDropdown from "../reusables/CustomDropdown";
import { useEffect, useState } from "react";
import { updateQCBatch } from "../store/batchListSlice";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import BatchSearchBox from "../reusables/BatchSearchBox";

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
  // ✅ Initialize steps properly
  const [qcResultData, setQcResultData] = useState(
    qcVariables.map((qc) => ({
      type: qc.type,
      results:
        qc.type === "Visual inspection" ? { visualInspectionMethod: "" } : null,
    }))
  );
  console.log(activeBatchId);
  const [form, setForm] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (activeBatch && activeBatch != 0 && batchesList) {
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

      if (qcData) {
        setQcResultData(qcData);
        const nextMeasurementStep = (qcData || []).findIndex(
          (result) => result.results == null || result.results == {}
        );
        console.log("Updated index:", nextMeasurementStep);
        if (nextMeasurementStep <= qcResultData.length - 1) {
          setActiveStep(nextMeasurementStep == -1 ? 0 : nextMeasurementStep);
        }
        if (nextMeasurementStep == qcResultData.length - 1) {
        }
      }
    }
  }, [activeBatch]);

  // ✅ Fixed handleSubmit logic
  function handleSubmit(e) {
    console.log("Hanlde submit");
    e.preventDefault();
    if (!activeBatch && form) return;
    const errors = validateStep();
    if (errors.length > 0) {
      setModalErrors(errors);
      setShowModal(true);
      return;
    }

    setQcResultData((prevSteps) => {
      const UpdatedSteps = [...prevSteps];
      UpdatedSteps[activeStep] = { ...UpdatedSteps[activeStep], results: form };

      console.log(form);
      console.log(UpdatedSteps[activeStep]);
      dispatch(
        updateQCBatch({
          batchId: activeBatch,
          qcResultData: UpdatedSteps,
          photo: null,
          saved: activeStep == UpdatedSteps.length - 1,
        })
      );
      const nextMeasurementStep = UpdatedSteps.findIndex(
        (result) => result.results == null || result.results == {}
      );
      console.log("Updated index:", nextMeasurementStep);
      if (
        nextMeasurementStep !== -1 &&
        nextMeasurementStep <= UpdatedSteps.length - 1
      ) {
        setActiveStep(nextMeasurementStep);
      } else if (
        nextMeasurementStep > UpdatedSteps.length - 1 ||
        nextMeasurementStep == -1
      ) {
        setModalErrors([]);
        setShowModal(true);
        setModalSuccess("🎉 Batch completed successfully!");
        setTimeout(() => {
          setShowModal(false);
          navigate("/");
        }, 1400);
      }
      setForm({});
      return UpdatedSteps;
    });
  }

  function validateStep() {
    const errors = [];
    const step = qcResultData[activeStep];

    if (!step) return errors;
    const variables = qcVariables.find((qcVar) => qcVar.type == step.type);
    console.log(variables);
    for (const v of variables.values) {
      console.log(form);
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
        if (
          min != undefined &&
          max != undefined &&
          (Number.isNaN(num) || num < min || num > max)
        ) {
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

  console.log(batchesList);
  return (
    <div>
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
      {batchesList ? (
        <BatchSearchBox
          batchesList={batchesList.filter((batch) => batch.status == "In QC")}
          activeBatch={activeBatch}
          setActiveBatch={setActiveBatch}
        />
      ) : null}
      {activeBatch ? (
        <div className="text-lg px-2 my-2 font-semibold rounded-md bg-blue-800 text-white width-full ">
          Batch on QC: {activeBatch}
        </div>
      ) : null}
      <form onSubmit={handleSubmit}>
        {activeBatch
          ? qcVariables.map((variable, index) => (
              <div
                key={index}
                className={`${
                  qcResultData[index].results != {} &&
                  qcResultData[index].results != null &&
                  activeStep != index
                    ? "bg-green-200"
                    : "bg-gray-50"
                } rounded-lg p-4 shadow-md border border-blue-100 mb-4`}
              >
                <div className=" flex text-lg text-left  mb-2 items-center">
                  <div
                    className={`${
                      activeStep === index
                        ? "bg-blue-600"
                        : qcResultData[index].results == {} ||
                          qcResultData[index].results == null
                        ? "bg-gray-600"
                        : "bg-green-600"
                    } text-white rounded-xl mx-2 w-5 h-5 text-sm text-center justify-center`}
                  >
                    {index + 1}
                  </div>
                  {variable.type}
                </div>
                <div
                  className={
                    qcResultData[index].results != {} &&
                    qcResultData[index].results != null &&
                    activeStep != index
                      ? "flex  items-center"
                      : ""
                  }
                >
                  <div
                    className={`${
                      activeStep === index
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                        : "w-full justify-between items-center"
                    }`}
                  >
                    {activeStep === index ? (
                      variable.values.map((value) => (
                        <div key={value.key} className="block my-2">
                          <label className="text-sm block mb-1 font-medium text-gray-700">
                            {value.name}
                            <span className="text-xs text-gray-400 ml-1">
                              {(() => {
                                const rule = qcRules?.[value.key];
                                if (
                                  !rule ||
                                  (rule.min == null && rule.max == null)
                                )
                                  return "";
                                return `(${rule.min ?? ""} - ${
                                  rule.max ?? ""
                                } ${value.metric || ""})`;
                              })()}
                            </span>
                          </label>

                          {value.type === "bool" ? (
                            <CustomDropdown
                              items={
                                qcRules?.[value.key]?.allowed ?? ["Yes", "No"]
                              }
                              onSelect={(selected) => {
                                console.log(selected);
                                setForm({ [value.key]: selected });

                                // setForm((prev) => ({
                                //   ...prev,
                                //   [value.key]: selected,
                                // }));
                              }}
                              placeHolder={form[value.key] ?? "Select"}
                            />
                          ) : (
                            <input
                              inputMode={
                                value.type == "number" ? "decimal" : "text"
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
                              disabled={false}
                            />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className=" text-sm mt-2">
                        {qcResultData[index]?.results &&
                        Object.keys(qcResultData[index].results).length > 0 &&
                        activeStep !== index ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-green-50 p-3 rounded-xl border border-gray-200 shadow-sm transition-all duration-300">
                            {Object.entries(qcResultData[index].results).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-green-100 rounded-lg p-2 px-3 hover:shadow-md transition"
                                >
                                  <span className="font-medium text-gray-700 ">
                                    {getVariableNameByKey(key)}:
                                  </span>
                                  <span className="text-gray-500  mt-1 sm:mt-0">
                                    {value ?? "-"}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="italic text-gray-400 text-center py-2">
                            Yet to test
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {qcResultData[index].results != {} &&
                  qcResultData[index].results != null &&
                  activeStep != index ? (
                    <BiEdit
                      className="text-right text-2xl ml-2"
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
            ))
          : null}
      </form>
    </div>
  );
}
