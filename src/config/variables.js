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

  drying: [
    { name: "Temperature", metric: "°C", key: "temperature" },
    { name: "Humidity", metric: "%", key: "humidity" },
  ],

  curing: [
    { name: "Temperature", metric: "°C", key: "temperature" },
    { name: "Time", metric: "minutes", key: "time" },
    {
      name: "Proper Vulcanization",
      metric: "yes/no",
      key: "vulcanizationStatus",
    },
  ],

  finishing: [
    { name: "Beading Roller Speed", metric: "rpm", key: "rollerSpeed" },
    { name: "Roller Pressure", metric: "MPa", key: "rollerPressure" },
    { name: "Powdered Gloves", metric: "yes/no", key: "powderedGloves" },
    {
      name: "Polymer Coating Concentration",
      metric: "g/L",
      key: "polymerConc",
    },
    {
      name: "Cornstarch Slurry Thickness",
      metric: "mm",
      key: "cornstarchThickness",
    },
    {
      name: "Chlorine Concentration",
      metric: "ppm",
      key: "chlorineConcentration",
    },
    { name: "Chlorine Exposure Time", metric: "seconds", key: "chlorineTime" },
  ],

  testingAndPackaging: [
    {
      type: "Visual inspection",
      values: [
        // Visual inspection
        {
          name: "Visual Inspection Method",
          metric: "type",
          key: "visualInspectionMethod",
          type: "text",
        }, // Manual/Automated
        {
          name: "Defect Type",
          metric: "text",
          key: "defectType",
          type: "text",
        },
        {
          name: "Defect Count",
          metric: "count",
          key: "visualDefectCount",
          type: "number",
        },
      ],
    },

    {
      type: " Water-tightness test",
      values: [
        {
          name: "Water-Tightness Test (AQL)",
          metric: "AQL",
          key: "waterTightnessAql",
          type: "number",
        },
        {
          name: "Pass Count",
          metric: "count",
          key: "waterTightnessPassCount",
          type: "number",
        },
        {
          name: "Fail Count",
          metric: "count",
          key: "waterTightnessFailCount",
          type: "number",
        },
      ],
    },
    {
      type: "Physical property tests",
      values: [
        //
        {
          name: "Force at Break",
          metric: "N",
          key: "forceAtBreak",
          type: "number",
        },
        {
          name: "Elongation at Break",
          metric: "%",
          key: "elongationAtBreak",
          type: "number",
        },
        {
          name: "Tensile Strength",
          metric: "MPa",
          key: "tensileStrength",
          type: "number",
        },
      ],
    },

    {
      type: "Dimensional tests",
      values: [
        { name: "Length", metric: "mm", key: "gloveLength", type: "number" },
        { name: "Palm Width", metric: "mm", key: "palmWidth", type: "number" },
        {
          name: "Thickness",
          metric: "mm",
          key: "gloveThickness",
          type: "number",
        },
      ],
    },

    {
      type: "Sterility test",
      values: [
        {
          name: "Sterility Test Result",
          metric: "pass/fail",
          key: "sterilityResult",
          type: "bool",
        },
      ],
    },

    {
      type: "Biocompatibility test",
      values: [
        {
          name: "Biocompatibility Result",
          metric: "pass/fail",
          key: "biocompatibilityResult",
          type: "bool",
        },
      ],
    },

    //
    {
      type: "Packaging data",
      values: [
        {
          name: "Batch Number",
          metric: "text",
          key: "batchNumber",
          type: "text",
        },
        {
          name: "Test Results Summary",
          metric: "text",
          key: "testResultsSummary",
          type: "text",
        },
        {
          name: "Packing Date",
          metric: "date",
          key: "packingDate",
          type: "text",
        },
        {
          name: "Sterilization Details",
          metric: "text",
          key: "sterilizationDetails",
          type: "text",
        },
        { name: "Comments", metric: "text", key: "comments", type: "text" },
      ],
    },
  ],
};
