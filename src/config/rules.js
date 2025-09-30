// src/config/validations.js
export const processValidations = {
  latexPreparation: {
    sulfur: { min: 0.5, max: 5.0 },
    zincOxide: { min: 0.1, max: 3.0 },
    compoundingTemp: { min: 60, max: 90 },
  },

  formerPreparation: {
    waterTemp: { min: 25, max: 45 },
    chlorineConc: { min: 200, max: 500 },
  },
};
