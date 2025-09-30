// src/config/validations.js
export const processValidations = {
  latexPreparation: {
    sulfur: { min: 0.5, max: 5.0 },
    zincOxide: { min: 0.1, max: 3.0 },
    accelerators: { min: 0.05, max: 1.0 },
    antioxidants: { min: 0.05, max: 1.5 },
    stabilizers: { min: 0.05, max: 2.0 },
    compoundingTime: { min: 10, max: 120 }, // minutes
    compoundingTemp: { min: 60, max: 90 }, // °C
    compoundViscosity: { min: 500, max: 2000 }, // cP
    finalPh: { min: 6.5, max: 8.0 }, // pH
  },

  formerPreparation: {
    waterTemp: { min: 25, max: 45 }, // °C
    chlorineConc: { min: 200, max: 500 }, // ppm
    coagulantPh: { min: 4.0, max: 6.5 }, // pH
    immersionSpeed: { min: 1, max: 10 }, // cm/s
    dwellTime: { min: 5, max: 60 }, // seconds
  },

  leaching: {
    waterTemp: { min: 40, max: 80 }, // °C
    flowRate: { min: 5, max: 50 }, // L/min
    duration: { min: 5, max: 60 }, // minutes
  },

  finishing: {
    rollerSpeed: { min: 50, max: 300 }, // rpm
    powderConc: { min: 1, max: 20 }, // g/L
    chlorineTime: { min: 10, max: 120 }, // seconds
  },
};
