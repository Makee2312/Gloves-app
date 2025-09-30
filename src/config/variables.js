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
};
