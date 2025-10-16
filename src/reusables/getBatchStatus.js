export const qcFalseVariables = [
  "visualDefectCount",
  "waterTightnessFailCount",
  "sterilityResult",
  "biocompatibilityResult",
];
export function getBatchStatus(batch) {
  if (!batch) return "Unknown";

  // 1️⃣ Derive base status if explicitly set
  if (
    batch.status &&
    batch.status.trim() !== "" &&
    batch.status != "Completed"
  ) {
    return batch.status;
  }
  if (batch.status === "Completed") {
    // 2️⃣ Check if QC failed — based on known fields
    const qcStep =
      batch.steps?.find((s) => s.processType?.toLowerCase().includes("qc")) ??
      {};

    // ✅ Safely check if QC failed (handles number-like strings too)
    const hasFailedQC = qcStep?.data?.some((stepData) =>
      qcFalseVariables.some((key) => {
        const value = stepData?.results?.[key];

        // Convert string numbers like "2" or "05" into real numbers
        const numericValue =
          typeof value === "string" && !isNaN(value.trim()) ? parseFloat(value.trim()) : value;

        return (
          (typeof numericValue === "number" && numericValue > 0) ||
          (typeof value === "string" && value.toLowerCase() === "fail")
        );
      })
    );


    if (hasFailedQC) {
      return "QC Failed";
    } else {
      return "Completed";
    }
  }

  // 4️⃣ Determine if any step started but not finished
  if (batch.steps && batch.steps.some((step) => step.saved)) {
    return "In progress";
  }

  // 5️⃣ Default fallback
  return "Yet to start";
}

export function getBatchColor(batchStatus) {
  return batchStatus === "Completed"
    ? "bg-green-100 text-green-700"
    : batchStatus === "QC Failed"
      ? "bg-red-100 text-red-700"
      : batchStatus === "In QC"
        ? "bg-pink-100 text-pink-600"
        : batchStatus === "In progress"
          ? "bg-yellow-100 text-yellow-600"
          : "bg-gray-100 text-gray-600";
}
