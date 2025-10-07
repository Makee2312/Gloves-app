// src/config/variables.js
export const processVariables = {
  latexPreparation: [
    { name: "Sulfur", metric: "grams", key: "sulfur" },
    { name: "Zinc Oxide", metric: "grams", key: "zincOxide" },
    { name: "Accelerators", metric: "grams", key: "accelerators" },
    { name: "Antioxidants", metric: "grams", key: "antioxidants" },
    { name: "Stabilizers", metric: "grams", key: "stabilizers" },
    { name: "Compounding Time", metric: "minutes", key: "compoundingTime" },
    { name: "Compounding Temperature", metric: "°C", key: "compoundingTemp" },
    { name: "Compound Viscosity", metric: "cP", key: "compoundViscosity" },
    { name: "Final pH", metric: "pH", key: "finalPh" },
  ],

  formerPreparation: [
    { name: "Water Temperature", metric: "°C", key: "waterTemp" },
    { name: "Chlorine Concentration", metric: "ppm", key: "chlorineConc" },
    { name: "Coagulant pH", metric: "pH", key: "coagulantPh" },
    { name: "Immersion Speed", metric: "cm/s", key: "immersionSpeed" },
    { name: "Dwell Time", metric: "seconds", key: "dwellTime" },
  ],

  leaching: [
    { name: "Water Temperature", metric: "°C", key: "waterTemp" },
    { name: "Flow Rate", metric: "L/min", key: "flowRate" },
    { name: "Duration", metric: "minutes", key: "duration" },
  ],

  finishing: [
    { name: "Beading Roller Speed", metric: "rpm", key: "rollerSpeed" },
    { name: "Powdering Concentration", metric: "g/L", key: "powderConc" },
    { name: "Chlorine Exposure Time", metric: "seconds", key: "chlorineTime" },
  ],
  stripping: [
    { name: "Stripping Method", metric: "type", key: "strippingMethod" }, // Manual/Automatic
    { name: "Cycle Time", metric: "seconds", key: "cycleTime" },
    { name: "Defect Count", metric: "count", key: "defectCount" },
  ],

  testingAndPackaging: [
    // Visual inspection
    {
      name: "Visual Inspection Method",
      metric: "type",
      key: "visualInspectionMethod",
    }, // Manual/Automated
    { name: "Defect Type", metric: "text", key: "defectType" },
    { name: "Defect Count", metric: "count", key: "visualDefectCount" },

    // Water-tightness test
    {
      name: "Water-Tightness Test (AQL)",
      metric: "AQL",
      key: "waterTightnessAql",
    },
    { name: "Pass Count", metric: "count", key: "waterTightnessPassCount" },
    { name: "Fail Count", metric: "count", key: "waterTightnessFailCount" },

    // Physical property tests
    { name: "Force at Break", metric: "N", key: "forceAtBreak" },
    { name: "Elongation at Break", metric: "%", key: "elongationAtBreak" },
    { name: "Tensile Strength", metric: "MPa", key: "tensileStrength" },

    // Dimensional tests
    { name: "Length", metric: "mm", key: "gloveLength" },
    { name: "Palm Width", metric: "mm", key: "palmWidth" },
    { name: "Thickness", metric: "mm", key: "gloveThickness" },

    // Sterility test
    {
      name: "Sterility Test Result",
      metric: "pass/fail",
      key: "sterilityResult",
    },

    // Biocompatibility test
    {
      name: "Biocompatibility Result",
      metric: "pass/fail",
      key: "biocompatibilityResult",
    },

    // Packaging data
    { name: "Batch Number", metric: "text", key: "batchNumber" },
    { name: "Test Results Summary", metric: "text", key: "testResultsSummary" },
    { name: "Packing Date", metric: "date", key: "packingDate" },
    {
      name: "Sterilization Details",
      metric: "text",
      key: "sterilizationDetails",
    },
  ],
};
