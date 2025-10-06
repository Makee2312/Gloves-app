import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStep, setActiveBatch, setStepSaved, completeBatch } from "../store/batchListSlice";
import { processValidations } from "../config/rules";
import { processVariables } from "../config/variables";
import { useNavigate, useLocation } from "react-router-dom";


const stepsConfig = [
  { key: "compoundPrep", title: "Compound Preparation", processType: "latexPreparation" },
  { key: "formerPrep", title: "Former Preparation", processType: "formerPreparation" },
  { key: "leaching", title: "Leaching", processType: "leaching" },
  { key: "finishing", title: "Finishing", processType: "finishing" },
];

export default function BatchLatexCreationForm({ onBack }) {

  const dispatch = useDispatch();
  const activeBatch = useSelector((state) => state.batchList.activeBatch);

  const [stepIdx, setStepIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [freezeInputs, setFreezeInputs] = useState(false);
  const location = useLocation(); 

  useEffect(() => {
    if (!activeBatch || !activeBatch.gloveBatchId) {
      onBack && onBack();
      return;
    }
    setFreezeInputs(
      activeBatch?.status === "Completed" || location?.state?.viewOnly
    );
  }, [activeBatch, onBack, location]);

  useEffect(() => {
    if (activeBatch && activeBatch.steps) {
      const idx = activeBatch.steps.findIndex(s => !s.saved);
      setStepIdx(idx === -1 ? stepsConfig.length - 1 : idx);

      setFreezeInputs(
        activeBatch.status === "Completed" || location?.state?.viewOnly
      );
    }
  }, [activeBatch, location]);

  // Validate ALL steps before finish
  function validateAllSteps(batchToCheck) {
    for (let i = 0; i < stepsConfig.length; i++) {
      const step = stepsConfig[i];
      const vars = processVariables[step.processType];
      const vals = processValidations[step.processType];
      const data = batchToCheck?.steps?.[i]?.data || {};
      for (const v of vars) {
        const val = data[v.key];
        if (val == null || val === "")
          return `${step.title}: ${v.name} is required.`;
        if (vals[v.key]) {
          if (Number(val) < vals[v.key].min || Number(val) > vals[v.key].max)
            return `${step.title}: ${v.name} must be between ${vals[v.key].min} and ${vals[v.key].max} ${v.metric}.`;
        }
      }
    }
    return null;
  }

  function handleStepSave(form, photo) {
    dispatch(updateStep({ batchId: activeBatch.gloveBatchId, stepIdx, form, photo }));
    if (stepIdx < stepsConfig.length - 1) setStepIdx(stepIdx + 1);
  }

  const batchList = useSelector(state => state.batchList.batchLs);

  function handleFinish(form, photo) {
    dispatch(updateStep({ batchId: activeBatch.gloveBatchId, stepIdx, form, photo }));

    setTimeout(() => {
      // get the latest batch (may be stale)
      let latestBatch =
        batchList.find(b => b.gloveBatchId === activeBatch.gloveBatchId) || activeBatch;

      // 🔑 merge in the current form/photo manually so it's fresh
      const mergedBatch = {
        ...latestBatch,
        steps: latestBatch.steps.map((s, i) =>
          i === stepIdx ? { ...s, data: form, photo } : s
        )
      };

      const err = validateAllSteps(mergedBatch);
      if (err) {
        setModalMsg(err);
        setShowModal(true);
        return;
      }

      dispatch(completeBatch(activeBatch.gloveBatchId));
      setFreezeInputs(true);
      setModalMsg("Batch completed successfully! ");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        setTimeout(() => { onBack && onBack(); }, 500);
      }, 1800);
    }, 200);
  }

  function getStepError(data) {
    const step = stepsConfig[stepIdx];
    const vars = processVariables[step.processType];
    const vals = processValidations[step.processType];
    for (const v of vars) {
      const val = data[v.key];
      if (val == null || val === "") return `${v.name} is required.`;
      if (vals[v.key]) {
        if (Number(val) < vals[v.key].min || Number(val) > vals[v.key].max)
          return `${v.name} must be between ${vals[v.key].min} and ${vals[v.key].max} ${v.metric}.`;
      }
    }
    return null;
  }

  // Show saved values in input forms
  const stepData = activeBatch?.steps?.[stepIdx]?.data || {};
  const stepPhoto = activeBatch?.steps?.[stepIdx]?.photo || null;

  // Progress tracking
  function isStepCompleted(idx) {
    return !!activeBatch?.steps?.[idx]?.saved;
  }

  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-100 pt-5 pb-10 px-2 md:px-0">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-4 space-y-6 relative transition duration-300 border border-blue-100">
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[1000] bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-3 border-2 border-blue-400">
              <div className="text-3xl text-blue-600 font-extrabold animate-bounce">
                🎉
              </div>
              <div className="text-lg font-semibold text-blue-700">{modalMsg}</div>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 mt-2"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Only Batch ID in sticky */}
        <div className="h-3 bg-blue-100 rounded-full">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-700"
              style={{
                width: `${((stepsConfig.filter((_, i) => isStepCompleted(i)).length) / stepsConfig.length) * 100}%`,
              }}
            />
          </div>

        <div className="sticky top-0 z-10 mb-2 bg-white rounded-lg p-3 shadow flex items-center justify-center border border-blue-100">
          <span className="text-xs font-bold uppercase text-blue-700">Batch:</span>
          <span className="text-base font-bold ml-2">{activeBatch?.gloveBatchId}</span>
        </div>

        {/* Step Tracker */}
        <div className="flex justify-between items-center w-full gap-2 mb-4">
          {stepsConfig.map((step, idx) => (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div
                className={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg transition duration-300 shadow-lg ${isStepCompleted(idx)
                    ? "bg-green-500 text-white"
                    : idx === stepIdx
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
              >
                {idx + 1}
              </div>
              <span
                className={`text-xs mt-2 text-center font-medium ${isStepCompleted(idx)
                    ? "text-green-600"
                    : idx === stepIdx
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Step Form */}
        <StepForm
          key={stepIdx}
          step={stepsConfig[stepIdx]}
          data={stepData}
          photo={stepPhoto}
          onSave={stepIdx === stepsConfig.length - 1 ? handleFinish : handleStepSave}
          getError={getStepError}
          lastStep={stepIdx === stepsConfig.length - 1}
          freeze={freezeInputs}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition duration-300"
            disabled={stepIdx === 0}
            onClick={() => setStepIdx(stepIdx - 1)}
          >
            Back
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded font-medium transition duration-300 ${stepIdx < stepsConfig.length - 1
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            disabled={stepIdx === stepsConfig.length - 1 || (!freezeInputs && !isStepCompleted(stepIdx))}
            onClick={() => setStepIdx(stepIdx + 1)}
          >
            Next
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="ml-2 px-4 py-2 rounded-lg bg-white text-blue-600 border border-blue-300 font-semibold hover:bg-blue-50 transition"
          >
            ← Back to Main
          </button>
        </div>
      </div>
    </div>
  );
}

// StepForm: disables only input fields if freeze is true
function StepForm({ step, data, photo, onSave, getError, lastStep, freeze }) {
  const [form, setForm] = useState(data || {});
  const [img, setImg] = useState(photo || null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(data || {});
    setImg(photo || null);
  }, [data, photo]);

  function handleChange(e, key) {
    if (freeze) return;
    setForm({ ...form, [key]: e.target.value });
  }
  function handlePhoto(e) {
    if (freeze) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (freeze) return;
    const err = getError(form);
    if (err) {
      setError(err);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setError("");
      onSave(form, img);
    }, 800);
  }
  const vars = processVariables[step.processType];

  return (
    <form
      className={`bg-gray-50 rounded-lg p-4 shadow-md space-y-4 transition duration-300 border border-blue-100 ${freeze ? "opacity-60 pointer-events-none" : ""
        }`}
      noValidate
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {vars.map((v) => (  
          <div key={v.key} className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">
              {v.name} <span className="text-gray-400 text-xs">({processValidations[step.processType][v.key]?.min } to {processValidations[step.processType][v.key]?.max} {v.metric})</span>
            </label>
            <input
              type="number"
              value={form[v.key] || ""}
              onChange={(e) => handleChange(e, v.key)}
              className="rounded-lg border px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition w-full"
              min={processValidations[step.processType][v.key]?.min}
              max={processValidations[step.processType][v.key]?.max}
              required
              disabled={freeze}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Upload Photo (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhoto}
          className="rounded border px-3 py-2"
          disabled={freeze}
        />
        {img && (
          <img
            src={img}
            alt="Step"
            className="mt-2 rounded-xl shadow w-32 h-32 object-cover border-2 border-blue-200"
          />
        )}
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 rounded px-2 py-1 text-xs font-semibold shadow">
          {error}
        </div>
      )}
      {!freeze && (
        <button
          type="submit"
          className={`mt-4 w-full py-2 rounded font-bold transition duration-300 ${saving
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          disabled={saving}
        >
          {saving ? "Saving..." : lastStep ? "Finish & Save" : "Save & Next"}
        </button>
      )}
      {freeze && (
        <div className="mt-4 w-full py-2 rounded font-bold text-green-700 text-center bg-green-50 border border-green-200 shadow">
          This batch is completed and locked for editing.
        </div>
      )}
    </form>
  );
}