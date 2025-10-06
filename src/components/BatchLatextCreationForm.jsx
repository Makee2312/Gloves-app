// src/components/BatchLatexCreationForm.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStep, completeBatch } from "../store/batchListSlice";
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
  const navigate = useNavigate();
  const location = useLocation();

  const activeBatch = useSelector((s) => s.batchList.activeBatch);
  const batchList = useSelector((s) => s.batchList.batchLs || []);

  // UI state
  const [stepIdx, setStepIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalErrors, setModalErrors] = useState([]); // array of { stepIndex, message }
  const [modalSuccess, setModalSuccess] = useState("");
  // batchLocked: when true the *inputs* should be frozen (batch Completed or viewOnly)
  const batchLocked = activeBatch?.status === "Completed" || !!location?.state?.viewOnly;

  // initialize current step
  useEffect(() => {
    if (!activeBatch || !activeBatch.gloveBatchId) {
      onBack && onBack();
      return;
    }
    const idx = (activeBatch.steps || []).findIndex((s) => !s.saved);
    setStepIdx(idx === -1 ? stepsConfig.length - 1 : idx);
  }, [activeBatch, onBack]);

  // Helpers: validate a single step (returns array of errors for that step)
  function validateStep(stepIndex, data) {
    const errors = [];
    const step = stepsConfig[stepIndex];
    if (!step) return errors;
    const vars = processVariables[step.processType] || [];
    const vals = processValidations[step.processType] || {};

    for (const v of vars) {
      const raw = data?.[v.key];
      const isMissing = raw === undefined || raw === null || String(raw).trim() === "";
      if (isMissing) {
        errors.push({ stepIndex, message: `${step.title}: ${v.name} is required.` });
        continue;
      }
      if (vals[v.key]) {
        const { min, max } = vals[v.key];
        const num = Number(raw);
        if (Number.isNaN(num) || num < min || num > max) {
          errors.push({
            stepIndex,
            message: `${step.title}: ${v.name} must be between ${min} and ${max} ${v.metric}.`,
          });
        }
      }
    }
    return errors;
  }

  // Validate all steps (returns array of errors)
  function validateAllSteps(batchToCheck) {
    const errors = [];
    for (let i = 0; i < stepsConfig.length; i++) {
      const data = batchToCheck?.steps?.[i]?.data || {};
      const e = validateStep(i, data);
      if (e.length) errors.push(...e);
    }
    return errors;
  }

  // Determine first unsaved step index (or -1 if none)
  const firstUnsavedIndex = (activeBatch?.steps || []).findIndex((s) => !s.saved);
  const firstUnsaved = firstUnsavedIndex === -1 ? stepsConfig.length - 1 : firstUnsavedIndex;

  // When user tries to change tab via the step indicators:
  function handleAttemptToSelectStep(idx) {
    if (batchLocked) return; // keep inputs locked, but we still allow selection of allowed steps below
    // allowed indices: 0..firstUnsaved (inclusive)
    if (idx > firstUnsaved) {
      // block - show modal prompting to complete the earlier step first
      const message = {
        stepIndex: firstUnsaved,
        message: `Please complete "${stepsConfig[firstUnsaved].title}" (Step ${firstUnsaved + 1}) before proceeding.`,
      };
      setModalErrors([message]);
      setModalSuccess("");
      setShowModal(true);
      setStepIdx(firstUnsaved); // switch to required step
      return;
    }
    // allowed; switch
    setStepIdx(idx);
  }

  // Handle per-step save (validates the step first). On success, mark saved and auto-advance.
  function handleStepSave(form, photo) {
    if (!activeBatch) return;
    const errors = validateStep(stepIdx, form);
    if (errors.length > 0) {
      // show modal listing step errors and stay on step
      setModalErrors(errors);
      setModalSuccess("");
      setShowModal(true);
      return;
    }

    // dispatch update
    dispatch(updateStep({ batchId: activeBatch.gloveBatchId, stepIdx, form, photo }));

    // auto-advance to next step if exists
    if (stepIdx < stepsConfig.length - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      // if it was the last step, keep it (user can press Finish below)
      // or you can optionally call handleFinish(form, photo) here.
    }
  }

  // Finish: update current step (if needed) then validate all and complete if OK
  function handleFinish(form, photo) {
    if (!activeBatch) return;

    // update current step first
    dispatch(updateStep({ batchId: activeBatch.gloveBatchId, stepIdx, form, photo }));

    // small delay to allow store to update (optional)
    setTimeout(() => {
      const latestBatch =
        batchList.find((b) => b.gloveBatchId === activeBatch.gloveBatchId) || activeBatch;
      const mergedBatch = {
        ...latestBatch,
        steps: (latestBatch.steps || []).map((s, i) => (i === stepIdx ? { ...s, data: form, photo } : s)),
      };

      const errors = validateAllSteps(mergedBatch);
      if (errors.length > 0) {
        setModalErrors(errors);
        setModalSuccess("");
        setShowModal(true);
        // bring the user to the first error step
        setStepIdx(errors[0].stepIndex);
        return;
      }

      // All good → complete
      dispatch(completeBatch(activeBatch.gloveBatchId));
      setModalErrors([]);
      setModalSuccess("🎉 Batch completed successfully!");
      setShowModal(true);

      // don't lock entire UI navigation; only inputs are frozen (batchLocked logic handles that)
      setTimeout(() => {
        setShowModal(false);
        setTimeout(() => onBack && onBack(), 500);
      }, 1400);
    }, 200);
  }

  // Inline per-step error for the displayed step
  function getStepError(data) {
    const errs = validateStep(stepIdx, data);
    return errs.length ? errs[0].message : null;
  }

  // per-step saved flag and step data
  const stepData = activeBatch?.steps?.[stepIdx]?.data || {};
  const stepPhoto = activeBatch?.steps?.[stepIdx]?.photo || null;
  const stepSaved = !!activeBatch?.steps?.[stepIdx]?.saved;

  // close modal helper
  function closeModal() {
    setShowModal(false);
    setModalErrors([]);
    setModalSuccess("");
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-100 pt-5 pb-10 px-2 md:px-0">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 border border-blue-100">
            {modalErrors && modalErrors.length > 0 ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl text-red-600">⚠️</div>
                  <h3 className="text-lg font-semibold text-red-700">Validation</h3>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-3">
                  {modalErrors.map((e, i) => (
                    <div key={i} className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                      <div className="font-medium">{e.message}</div>
                      <div className="text-xs text-gray-500 mt-1">Step {e.stepIndex + 1}: {stepsConfig[e.stepIndex]?.title}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-3 text-green-600">🎉</div>
                <div className="text-lg font-semibold text-green-700">{modalSuccess}</div>
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main container */}
      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Batch header */}
        <div className="sticky top-3 z-10 bg-white p-3 rounded-lg shadow-sm border border-blue-50 text-center">
          <span className="text-xs font-bold uppercase text-blue-700">Batch:</span>
          <span className="text-base font-bold ml-2">{activeBatch?.gloveBatchId ?? "—"}</span>
        </div>

        {/* Clickable step indicators (tabs) */}
        <div className="flex items-center justify-between gap-3">
          {stepsConfig.map((s, idx) => {
            const completed = !!activeBatch?.steps?.[idx]?.saved;
            const active = idx === stepIdx;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => handleAttemptToSelectStep(idx)}
                className={`flex-1 flex flex-col items-center py-2 px-1 focus:outline-none transition ${batchLocked ? "opacity-90" : "hover:scale-105"}`}
                aria-current={active ? "true" : "false"}
              >
                <div className={`rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg ${completed ? "bg-green-500 text-white" : active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {idx + 1}
                </div>
                <div className={`mt-2 text-xs text-center font-medium ${completed ? "text-green-600" : active ? "text-blue-600" : "text-gray-400"}`}>
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-700"
              style={{
                width: `${(stepsConfig.filter((_, i) => !!activeBatch?.steps?.[i]?.saved).length / stepsConfig.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Step form (pass stepSaved & batchLocked) */}
        <StepForm
          key={stepIdx}
          stepIndex={stepIdx}
          step={stepsConfig[stepIdx]}
          data={stepData}
          photo={stepPhoto}
          onSave={stepIdx === stepsConfig.length - 1 ? handleFinish : handleStepSave}
          validateStep={validateStep}
          onValidationFail={(errs) => { setModalErrors(errs); setShowModal(true); }}
          getError={getStepError}
          lastStep={stepIdx === stepsConfig.length - 1}
          stepSaved={stepSaved}
          batchLocked={batchLocked}
        />

        {/* Footer: navigation to main */}
        <div className="flex justify-end">
          <button onClick={() => navigate("/")} className="px-4 py-2 rounded-lg bg-white text-blue-600 border border-blue-300 font-semibold hover:bg-blue-50">
            ← Back to Main
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- StepForm -------------------- */
function StepForm({
  stepIndex,
  step,
  data,
  photo,
  onSave,
  validateStep,
  onValidationFail,
  getError,
  lastStep,
  stepSaved,
  batchLocked,
}) {
  const [form, setForm] = useState(data || {});
  const [img, setImg] = useState(photo || null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // when step changes or data changes, reset local values
  useEffect(() => {
    setForm(data || {});
    setImg(photo || null);
    setError("");
  }, [data, photo, stepIndex]);

  const vars = processVariables[step.processType] || [];

  function handleChange(e, key) {
    // if this step is saved or batch locked, prevent edits
    if (stepSaved || batchLocked) return;
    setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function handlePhoto(e) {
    if (stepSaved || batchLocked) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (stepSaved || batchLocked) return;

    // validate this step
    const errs = validateStep(stepIndex, form);
    if (errs.length > 0) {
      setError(errs[0].message);
      onValidationFail(errs);
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setError("");
      onSave(form, img);
    }, 450);
  }

  return (
    <form onSubmit={handleSubmit} noValidate 
    className={`bg-gray-50 rounded-lg p-4 shadow-md border border-blue-100 ${stepSaved ? "opacity-80" : ""}`}
    autoComplete="off">
      <div className="grid grid-cols-1 gap-4">
        {vars.map((v) => (
          <div key={v.key} className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">
              {v.name}
              <span className="text-gray-400 text-xs ml-2">
                ({processValidations[step.processType]?.[v.key]?.min ?? "—"} - {processValidations[step.processType]?.[v.key]?.max ?? "—"} {v.metric})
              </span>
            </label>

            <input
              inputMode="decimal"
              type="number"
              value={form[v.key] ?? ""}
              onChange={(e) => handleChange(e, v.key)}
              className="rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder={`Enter ${v.name}`}
              disabled={stepSaved || batchLocked}
            />
          </div>
        ))}
      </div>

      <div className="mt-3">
        <label className="text-sm font-medium text-gray-700">Upload Photo (optional)</label>
        <input type="file" accept="image/*" onChange={handlePhoto} className="mt-1 text-sm" disabled={stepSaved || batchLocked} />
        {img && <img src={img} alt="step" className="mt-2 rounded-lg shadow border w-32 h-32 object-cover" />}
      </div>

      {/* {error && <div className="bg-red-100 text-red-700 rounded px-2 py-1 text-xs font-semibold mt-3">{error}</div>} */}

      {/* Show Save/Finish only if this step is NOT already saved and batch NOT locked.
          If step is saved, inputs are disabled but user can navigate to other steps. */}
      {!stepSaved && !batchLocked && (
        <button type="submit" disabled={saving} className={`mt-4 w-full py-2 rounded font-semibold ${saving ? "bg-gray-400 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
          {saving ? "Saving..." : lastStep ? "Finish & Save" : "Save & Next"}
        </button>
      )}

      {stepSaved && (
        <div className="mt-4 w-full py-2 rounded text-green-700 bg-green-50 border border-green-200 text-center font-semibold">
          Saved ✓
        </div>
      )}

      {batchLocked && !stepSaved && (
        <div className="mt-4 w-full py-2 rounded text-gray-700 bg-gray-50 border border-gray-200 text-center font-medium">
          Inputs are locked for this batch.
        </div>
      )}
    </form>
  );
}
